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
define(['require', 'log', 'jquery', 'd3', 'd3utils', 'backbone', 'lodash', 'diagram_core', 'main_elements',
        './service-outline', 'processors', './life-line',
        'ballerina_models/containable-processor-element', 'ballerina_models/life-line', 'ballerina_models/message-point',
        'ballerina_models/message-link', 'app/ballerina/utils/module', 'app/ballerina/utils/processor-factory',
        'svg_pan_zoom'],

    function (require, log, $, d3, D3Utils, Backbone, _, DiagramCore, MainElements,
              DiagramPreview, Processors, LifeLineView,
              ContainableProcessorElement, LifeLine, MessagePoint,
              MessageLink, utils, ProcessorFactory,
              svgPanZoom) {

        var ResourceView = DiagramCore.Views.ShapeView.extend(
            /** @lends ResourceView.prototype */
            {
                /**
                 * @augments Backbone.View
                 * @constructs
                 * @class ResourceView Represents the view for a resource in a ballerina service
                 * @param {Object} options Rendering options for the view.
                 * @param d3Group The svg group of the resource.
                 * @param service The service model. i.e the parent of this resource.
                 */
                initialize: function (options) {
                    this.parentService = options.serviceView;

                    // Setting
                    options.diagram =  {};
                    options.diagram.defaultWorker = options.diagram.defaultWorker || {};
                    options.diagram.defaultWorker.centerPoint = options.diagram.defaultWorker.centerPoint || {};
                    options.diagram.defaultWorker.centerPoint.x = options.diagram.defaultWorker.centerPoint.x || 270;
                    options.diagram.defaultWorker.centerPoint.y = options.diagram.defaultWorker.centerPoint.y || 180;
                    // options.diagram.width = options.diagram.width || "100%";
                    // options.diagram.padding =  options.diagram.padding || 50;
                    // options.diagram.viewBoxWidth =  options.diagram.viewBoxWidth || 1000;
                    // options.diagram.viewBoxHeight =  options.diagram.viewBoxHeight || 1000;
                    //
                    // options.diagram.class = options.diagram.class || "diagram";
                    // options.diagram.selector = options.diagram.selector || ".diagram";
                    // options.diagram.wrapper = options.diagram.wrapper || {};
                    // // CHANGED
                    // options.diagram.wrapperId = options.wrapperId || "diagramWrapper";
                    // options.diagram.grid = options.diagram.grid || {};
                    // options.diagram.grid.height = options.diagram.grid.height || 25;
                    // options.diagram.grid.width = options.diagram.grid.width || 25;
                    this.options = options;
                },

                /**
                 * Rendering resources.
                 */
                render: function () {
                    // Creating svg group for the resource
                    this.resourceWrapper = this.getD3Ref().draw.group(this.getD3Ref());

                    // Setting border to
                    this.resourceWrapper.attr("id", "resourceWrapper");

                    this.resourceWrapper = D3Utils.decorate(this.resourceWrapper);

                    // If this is the first resource of the service, then draw the resource with hard coded positions. Else use the position of the previous resource.
                    if (this.getCurrentResourceIndex() == 0) {
                        this.resourceHeaderWrapper = this.resourceWrapper.draw.basicRect(75, 110, 400, 25, 0, 0, this.resourceWrapper);
                        this.resourceHeaderWrapper.attr("stroke", "black");

                        this.resourceBodyWrapper = this.resourceWrapper.draw.basicRect(75, 110 + 25, 400, 175, 0, 0, this.resourceWrapper);
                        this.resourceBodyWrapper.attr("stroke", "black");
                    } else {

                    }
                    this.toolPalette = this.parentService.toolPalette;
                    this.d3el = this.resourceWrapper;
                },

                /**
                 * Rendering the default worker belonging to the current resource model.
                 */
                renderDefaultWorker: function () {
                    var defaultWorker = this.model.get("defaultWorker");
                    var defaultWorkerCenterPoint = utils.createPoint(this.options.diagram.defaultWorker.centerPoint.x, this.options.diagram.defaultWorker.centerPoint.y);
                    defaultWorker.set("centerPoint", defaultWorkerCenterPoint);
                    var defaultWorkerOption = {
                        model: defaultWorker,
                        serviceView: this.parentService,
                        class: _.get(MainElements, 'lifelines.DefaultWorker.class')
                    };
                    var defaultWorkerView = new LifeLineView(defaultWorkerOption);
                    defaultWorkerView.render();
                    defaultWorkerView.renderProcessors();
                    defaultWorkerView.renderMessages();
                },

                /**
                 * Rendering the workers belonging to the current resource model.
                 */
                renderWorkers: function () {
                    var workers = this.model.get("workers");
                    // TODO : iterate the workers and create the lifelines.
                },

                /**
                 * Rendering local endpoints belonging to the current resource model.
                 */
                renderLocalEndpoints: function () {
                    // Drawing local endpoints.
                    var localEndpoints = this.model.get("endpoints");
                    if (_.size(localEndpoints) > 0) {
                        for (var localEndpoint in localEndpoints) {
                            var localEndpointOptions = {
                                model: localEndpoint,
                                serviceView: this.parentService,
                                class: _.get(MainElements, 'lifelines.Endpoint.class')
                            };
                            var localEndpointView = new LifeLineView(localEndpointOptions);
                            localEndpointView.render();
                        }
                    }
                },

                /**
                 * Gets the current index of the resource of the parent service.
                 * @returns {*} The index.
                 */
                getCurrentResourceIndex: function() {
                    return _.findIndex(this.parentService.model.get("resources").models, this.model);
                },
            });

        return ResourceView;
    });

