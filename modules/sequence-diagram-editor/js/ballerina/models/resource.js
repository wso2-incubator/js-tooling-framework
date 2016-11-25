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

define(['require','log', 'jquery', 'd3', 'backbone', 'lodash', 'diagram_core', 'tree_node', './life-line', './message-point', 'app/ballerina/utils/module', 'main_elements'],

    function (require, log, $, d3, Backbone, _, DiagramCore, TreeNode, LifeLine, MessagePoint, utils, MainElements) {

        var LocalEndpointCollection = Backbone.Collection.extend({
            modelName: "LocalEndpointCollection",
            model: LifeLine
        });

        var WorkerCollection = Backbone.Collection.extend({
            modelName: "WorkerCollection",
            model: LifeLine
        });

    /**
     * Resource model refers to an resource(HTTP method) which allows to contain elements(mediators,actions), endpoints
     * and workers.
     */
    var Resource = DiagramCore.Models.Shape.extend(
    /** @lends Resource.prototype */
    {
        /**
         * @augments Backbone.Model
         * @constructs
         * @class Resource represents the model for a resource in a ballerina Service.
         */
        initialize: function (attributes, options) {
            DiagramCore.Models.Shape.prototype.initialize.call(this, attributes, options);

            // When predefined set of models is not passed when creating a service.
            if (_.isUndefined(attributes)) {
                this.reloadDiagramArea();
            } else {
                this.defaultWorker(attributes.defaultWorker);
                this.elements(attributes.elements);
                this.endpoints(attributes.localEndpoints);
                this.workers(attributes.workers);

                this.httpMethod = attributes.httpMethod;
                this.contextPath = attributes.contextPath;
                this.centerPoint = attributes.centerPoint;
            }

            this.selectedNode = null;

            this.destinationLifeLine = null;
            this.deepestPointY = 100;
            this.sourceLifeLineY = 0;
            this.X = 0;
            this.highestLifeline = null;
        },

        defaults: {
            centerPoint: new DiagramCore.Models.Point({x: 0, y: 0}),
            type: "Resource",
            httpMethod: "GET",
            contextPath: "/"
        },

        modelName: "Resource",

        selectedNode: null,

        lifeLineMap: {},

        destinationLifeLine: null,

        // setter/getter for default worker
        defaultWorker: function(defaultWorker) {
            if (_.isUndefined(defaultWorker)) {
                return this.get('defaultWorker');
            } else {
                this.set('defaultWorker', defaultWorker);
            }
        },

        // setter/getter for elements such as processors
        elements: function (diagramElements) {
            if (_.isUndefined(diagramElements)) {
                return this.get('elements');
            } else {
                this.set('elements', diagramElements);
            }
        },

        // setter/getter for endpoints
        endpoints: function (diaElements) {
            if (_.isUndefined(diaElements)) {
                return this.get('endpoints');
            } else {
                this.set('endpoints', diaElements);
            }
        },

        // setter/getter for workers
        workers: function (diaElements) {
            if (_.isUndefined(diaElements)) {
                return this.get('workers');
            } else {
                this.set('workers', diaElements);
            }
        },

        // getter of element count
        elementsCount: function () {
            return _.size(this.get('elements'));
        },

        // getter for endpoint count
        endPointCount: function () {
            return _.size(this.get('endpoints'));
        },

        // getter for worker count
        workerCount: function () {
            return _.size(this.get('workers'));
        },

        // function for adding a new element.
        addElement: function (diagramElement, opts) {
            // Check if added element an instance of DiagramCore.Models.DiagramElements.
            if (diagramElement instanceof DiagramCore.Models.DiagramElement){
                // Check if added element has a type.
                if (diagramElement.get('type')) {
                    var diagramElementType = diagramElement.get('type');
                    switch (diagramElementType) {
                        case "DefaultWorker":
                            this.set('defaultWorker', diagramElement, opts);
                            break;
                        case "EndPoint":
                            this.get('endpoints').add(diagramElement, opts);
                            break;
                        case "Elements":
                            this.get('elements').add(diagramElement, opts);
                            break;
                        default:
                            log.error("Unknown diagram element type added to a resource.:" + diagramElement);
                    }

                    this.lifeLineMap[diagramElement.attributes.centerPoint.attributes.x] = diagramElement;
                } else {
                    log.error('Added element does not contain a \'type\' attribute: ' + diagramElement);
                }
            } else {
                log.error('Added element is not an instance of diagram element: ' + diagramElement);
            }

        },

        positionTemp: undefined,

        dynamicMessage: undefined,

        test: undefined,

        parseTree: function() {

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
                        }else if(mediator.get('message').get('destination').get('parent').get('cssClass') === "endpoint"){
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
                    ((resourceModel.attributes.parameters[2].value==true) ? '@GET\n' : '') +
                    ((resourceModel.attributes.parameters[3].value==true) ? '@PUT\n' : '') +
                    ((resourceModel.attributes.parameters[4].value==true) ? '@POST\n' : '') +
                    '@Path ("' + resourceModel.attributes.parameters[1].value +'")\n'
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

            // Creating default worker
            var defaultWorkerLifeLineCenterPoint = utils.createPoint(100, 50);
            var defaultWorkerLifeLineType = "DefaultWorker";
            var defaultWorkerLifeLineDef = _.get(MainElements, 'lifelines.DefaultWorker');

            var defaultWorkerLifeLine = utils.createLifeLine("DefaultWorker", defaultWorkerLifeLineCenterPoint, defaultWorkerLifeLineDef.class, defaultWorkerLifeLineDef.utils,
                defaultWorkerLifeLineDef.parameters, defaultWorkerLifeLineDef.textModel, defaultWorkerLifeLineType, defaultWorkerLifeLineDef);

            var defaultWorker = defaultWorkerLifeLine;
            var elements = new DiagramElements([], {diagram: this});
            var localEndpoints = new LocalEndpointCollection();
            var workers = new WorkerCollection();

            this.defaultWorker(defaultWorker);
            this.elements(elements);
            this.endpoints(localEndpoints);
            this.workers(workers);
        }

    });
    return Resource;

});
