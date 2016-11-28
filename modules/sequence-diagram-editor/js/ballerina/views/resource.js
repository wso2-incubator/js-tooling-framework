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

                    // Creating options for drawing if they doesn't exists.
                    options.diagram =  {};
                    options.diagram.defaultWorker = options.diagram.defaultWorker || {};
                    options.diagram.defaultWorker.centerPoint = options.diagram.defaultWorker.centerPoint || {};
                    options.diagram.defaultWorker.centerPoint.x = options.diagram.defaultWorker.centerPoint.x || 270;
                    options.diagram.defaultWorker.centerPoint.y = options.diagram.defaultWorker.centerPoint.y || 180;
                    options.canvas = this.parentService.d3el;

                    DiagramCore.Views.ShapeView.prototype.initialize.call(this, options);

                    this.options = options;
                },

                /**
                 * Rendering resources.
                 */
                render: function () {
                    // Creating svg group for the resource
                    var d3Ref = this.getD3Ref();
                    var group = d3Ref.draw.group(this.getD3Ref());
                    var viewObj = this;
                    var width = viewObj.model.width;
                    var height = viewObj.model.height;
                    var startX = viewObj.model.get('centerPoint').x() - width/2 - 40;
                    var startY = viewObj.model.get('centerPoint').y();
                    var headerHeight = 20;
                    var resourceBodyWrapper;
                    var resourceHeaderWrapper;
                    this.resourceWrapper = {};

                    // Setting border to
                    group.attr("id", "resourceWrapper");

                    // If this is the first resource of the service, then draw the resource with hard coded positions. Else use the position of the previous resource.
                    if (this.getCurrentResourceIndex() == 0) {
                        resourceBodyWrapper = group.draw.basicRect(startX, startY, width, height, 0, 0, group);
                        resourceBodyWrapper.attr('class', 'resource-body');
                        resourceHeaderWrapper = group.draw.basicRect(startX, startY, width, headerHeight, 0, 0, group);
                        resourceHeaderWrapper.attr('class', 'resource-header');
                    } else {

                    }
                    this.toolPalette = this.parentService.toolPalette;
                    group.resourceBody = resourceBodyWrapper;
                    group.resourceHeader = resourceHeaderWrapper;
                    this.d3el = group;
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
                    var defaultWorkerBottomY = parseInt(defaultWorkerView.d3el.bottomShape.attr('y')) +
                        parseInt(defaultWorkerView.d3el.bottomShape.attr('height'));
                    var defaultWorkerRightX = parseInt(defaultWorkerView.d3el.bottomShape.attr('x')) +
                        parseInt(defaultWorkerView.d3el.bottomShape.attr('width'));
                    this.increaseElementHeight(defaultWorkerBottomY);
                    this.increaseElementWidth(defaultWorkerRightX);
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

                /**
                 * Increase the height of the wrapper
                 */
                increaseElementHeight: function (workerBottomY) {
                    // TODO: value 30 has to get from a configuration value
                    var height = workerBottomY - this.d3el.resourceBody.attr('y') + 30;
                    this.d3el.resourceBody.attr("height", height);
                },

                /**
                 * Increase the width of the wrapper
                 */
                increaseElementWidth: function (workerRightX) {
                    // TODO: value 200 has to get from a configuration value
                    var height = workerRightX - this.d3el.resourceBody.attr('x') + 200;
                    this.d3el.resourceBody.attr("width", height);
                    this.d3el.resourceHeader.attr("width", height);
                }
            });

        return ResourceView;
    });

