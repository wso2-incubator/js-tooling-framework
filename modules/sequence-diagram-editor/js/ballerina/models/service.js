/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

define(['require', 'log', 'jquery', 'd3', 'backbone', 'lodash', 'diagram_core', 'tree_node', './life-line', './message-point', './resource'],

    function (require, log, $, d3, Backbone, _, DiagramCore, TreeNode, LifeLine, MessagePoint, Resource) {

        var ResourceCollection = Backbone.Collection.extend({
            modelName: "ResourceCollection",
            model: Resource
        });

        /**
         * Resource model refers to an resource(HTTP method) which allows to contain source lifeline, endpoints lifelines
         * and resources.
         */
        var Service = Backbone.Model.extend(
            /** @lends Service.prototype */
            {
                /**
                 * @augments Backbone.Model
                 * @constructs
                 * @class Service represents the model for a ballerina Service.
                 */
                initialize: function (attributes, options) {
                    // When predefined set of models is not passed when creating a service.
                    if (_.isUndefined(attributes)) {
                        this.reloadDiagramArea();
                    } else {
                        this.source(attributes.source);
                        this.endpoints(attributes.endpoints);
                        this.resources(attributes.resources);
                    }

                    this.selectedNode = null;
                    this.destinationLifeLine = null;
                    this.deepestPointY = 100;
                    this.sourceLifeLineY = 0;
                    this.highestLifeline = null;
                },

                modelName: "Service",

                selectedNode: null,

                lifeLineMap: {},

                destinationLifeLine: null,

                // setter/getter for source/client.
                source: function (source) {
                    if (_.isUndefined(source)) {
                        return this.get('source');
                    } else {
                        this.set('source', source);
                    }
                },

                // setter/getter for global endpoints.
                endpoints: function (endpoints) {
                    if (_.isUndefined(endpoints)) {
                        return this.get('endpoints');
                    } else {
                        this.set('endpoints', endpoints);
                    }
                },

                // getter for endpoint count.
                endpointsCount: function () {
                    return _.size(this.get('endpoints'));
                },

                // setter/getter for resources.
                resources: function (resources) {
                    if (_.isUndefined(resources)) {
                        return this.get('resources');
                    } else {
                        this.set('resources', resources);
                    }
                },

                // getter of resource count.
                resourceCount: function () {
                    return _.size(this.get('resources'));
                },

                // function for adding a new element.
                addElement: function (diagramElement, opts) {
                    // Check if added element an instance of DiagramCore.Models.DiagramElements.
                    if (diagramElement instanceof DiagramCore.Models.DiagramElement){
                        // Check if added element has a type.
                        if (diagramElement.get('type')) {
                            var diagramElementType = diagramElement.get('type');

                            switch(diagramElementType) {
                                case "Source":
                                    this.get('source').add(diagramElement, opts);
                                    break;
                                case "EndPoint":
                                    this.get('endpoints').add(diagramElement, opts);
                                    break;
                                case "Resource":
                                    this.get('resources').add(diagramElement, opts);
                                    break;
                                default:
                            }
                        } else {
                            log.error('Added element does not contain a \'type\' attribute: ' + diagramElement);
                        }
                    } else {
                        log.error('Added element is not an instance of diagram element: ' + diagramElement);
                    }

                    this.lifeLineMap[diagramElement.attributes.centerPoint.attributes.x] = diagramElement;
                },

                positionTemp: undefined,

                dynamicMessage: undefined,

                test: undefined,

                parseTree: function () {

                    var TreeRoot;

                    var buildTree = function (resourceModel) {
                        // Until the message variable concept introduce to the tooling we will be creating a message called response on behalf of the user
                        var rootNode = new TreeNode("Resource", "Resource", "resource passthrough (message m) {\nmessage response;", "}");
                        for (var itr = 0; itr < (resourceModel.get('children').models).length; itr++) {
                            var mediator = (resourceModel.get('children').models)[itr];

                            // Check whether the mediator is a message point from the resource to the source.
                            // If so handle it differently
                            if (mediator instanceof MessagePoint) {
                                // Check the message point is from resource to the source
                                if (mediator.get('message').get('destination').get('parent').get('title') === "Source") {
                                    var node = new TreeNode("ResponseMsg", "ResponseMsg", "reply response", ";");
                                    rootNode.getChildren().push(node);
                                } else if (mediator.get('message').get('destination').get('parent').get('cssClass') === "endpoint") {
                                    //This section will handle "invoke" mediator transformation.
                                    var endpoint = mediator.get('message').get('destination').get('parent').attributes.parameters[0].value;
                                    var uri = mediator.get('message').get('destination').get('parent').attributes.parameters[1].value;
                                    // When we define the properties, need to extract the endpoint from the property
                                    definedConstants["HTTPEP"] = {name: endpoint, value: uri};

                                    var invokeNode = new TreeNode("InvokeMediator", "InvokeMediator", ("response = invoke(endpointKey=" + endpoint + ", messageKey=m)"), ";");
                                    rootNode.getChildren().push(invokeNode);
                                }
                            } else {
                                rootNode.getChildren().push((mediator.get('utils')).getMySubTree(mediator));
                            }
                        }
                        log.debug(rootNode);
                        return rootNode;
                    };

                    var finalSource = "";

                    var includeConstants = function (resourceModel) {
                        // TODO: Need to handle this properly
                        // Defining the global constants
                        for (var key in definedConstants) {
                            if (_.isEqual(key, "HTTPEP")) {
                                finalSource += "constant endpoint " + definedConstants[key].name + " = new HTTPEndPoint(\"" +
                                    definedConstants[key].value + "\");\n";
                            }
                        }

                        // For the moment we are injecting the API methods directly hardcoded here at the moment.
                        // After the properties view implementation those can be dynamically changed
                        finalSource += "\n" +
                            ((resourceModel.attributes.parameters[2].value == true) ? '@GET\n' : '') +
                            ((resourceModel.attributes.parameters[3].value == true) ? '@PUT\n' : '') +
                            ((resourceModel.attributes.parameters[4].value == true) ? '@POST\n' : '') +
                            '@Path ("' + resourceModel.attributes.parameters[1].value + '")\n'
                    };

                    var traverse = function (tree, finalSource) {

                        // Define the Resource methods and the context path (@GET, @POST, etc and @Path("/resourcePath")")

                        // Define the mediation logic
                        finalSource = finalSource + "" + tree.configStart;
                        var arr = tree.getChildren();
                        for (var a = 0; a < arr.length; a++) {
                            var node = arr[a];
                            finalSource = traverse(node, finalSource);
                        }
                        finalSource = finalSource + tree.configEnd;

                        return finalSource;
                    };
                    TreeRoot = buildTree(this.get('diagramResourceElements').models[0]);
                    includeConstants(this.get('diagramResourceElements').models[0]);
                    return traverse((TreeRoot), finalSource);
                },

                reloadDiagramArea: function () {
                    var DiagramElements = DiagramCore.Models.DiagramElements;

                    // A service can have only one single source/client lifeline.
                    var source = new DiagramElements();
                    // A service can have multiple endpoints. i.e global endpoints which are shared among all resources.
                    var globalEndpoints = new DiagramElements([], {diagram: this});
                    // A service can have multiple resources.
                    var resourceCollection = new ResourceCollection();

                    this.source(source);
                    this.endpoints(globalEndpoints);
                    this.resources(resourceCollection);
                },

                defaults: {}

            });

        return Service;

    });
