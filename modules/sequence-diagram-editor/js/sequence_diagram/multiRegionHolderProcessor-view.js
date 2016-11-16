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

/**
 * SequenceD-Views Module extension.
 *
 * Definition of Backbone Views required for Sequence Diagrams.
 */
var SequenceD = (function (sequenced) {
    var views = sequenced.Views = sequenced.Views || {};


    var MultiRegionProcessorView = Diagrams.Views.ShapeView.extend(
        /** @lends MultiRegionProcessorView.prototype */
        {
            /**
             * @augments ProcessorView
             * @constructs
             * @class MultiRegionProcessorView Represents the view for MultiRegionProcessor(Eg: Fork Join etc.)
             * components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, center, parentModel) {
                Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                var viewObj = this;
                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group();
                var elementRegions = viewObj.model.elementsRegionProcessors().models;

                for (var i = 0; i < elementRegions.length; i ++) {
                    var regionModel = elementRegions[i];
                    var startX = 0;
                    if (i > 0) {
                        startX = elementRegions[i - 1].get('centerPoint').x() +
                            elementRegions[i - 1].getWidth()/2 + elementRegions[i].getWidth()/2;
                    } else {
                        startX = center.x() - viewObj.model.getWidth()/2 + regionModel.getWidth()/2;
                    }
                    var startY = center.y() - 15;
                    var centerPoint = new GeoCore.Models.Point({x: startX, y: startY + 30});
                    regionModel.set('centerPoint', centerPoint);
                    var processorView = new SequenceD.Views.ElementsRegionProcessorView({model: regionModel,
                        options: lifeLineOptions});
                    processorView.render("#" + defaultView.options.diagram.wrapperId, centerPoint, viewObj.model);

                }

                this.model.setHeight(elementRegions[0].getHeight());
                parentModel.setHeight(elementRegions[0].getHeight());

                var rect = d3Ref.draw.rectWithTitle(center, 100, 30, viewObj.model.getWidth(),
                    elementRegions[0].getHeight(), 0, 0, group, '#ffffff', "Test");

                this.d3el = rect;
                return rect;
            }
        });

    var MultiRegionHolderProcessorView = Diagrams.Views.ShapeView.extend(
        /** @lends MultiRegionHolderProcessorView.prototype */
        {
            /**
             * @augments ProcessorView
             * @constructs
             * @class MultiRegionHolderProcessor Represents the view for Multiple region holder of
             * the MultiRegionProcessorView (Eg: Fork Join etc.)
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, center, parentModel) {
                Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                var viewObj = this;
                var multiRegions = viewObj.model.multiRegionProcessors().models;
                var yOffset = 0;
                for (var i = 0; i < multiRegions.length; i ++) {
                    var firstRegionElement = multiRegions[i].elementsRegionProcessors().models[0];
                    var startX = center.x() + (multiRegions[i].getWidth()/2 - firstRegionElement.getWidth()/2);
                    var centerPoint = new GeoCore.Models.Point({x: startX, y: center.y() + yOffset});
                    multiRegions[i].set('centerPoint', centerPoint);
                    var processorView = new SequenceD.Views.MultiRegionProcessorView({model: multiRegions[i],
                        options: lifeLineOptions});
                    yOffset += processorView.model.getHeight();
                    processorView.render("#" + defaultView.options.diagram.wrapperId, centerPoint, viewObj.model);
                }
            }
        });

    var ElementsRegionProcessorView = Diagrams.Views.ShapeView.extend(
        /** @lends MultiRegionProcessorView.prototype */
        {
            /**
             * @augments ElementsRegionProcessorView
             * @constructs
             * @class ElementsRegionProcessorView Represents the view which contains the other processor, main elements,
             * etc (Eg: Fork Join)
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, center, parentModel) {
                Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                var viewObj = this;
                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group();
                var startX = center.x() - viewObj.model.getWidth()/2;
                var startY = center.y();

                // First draw the children and then decide the outer region height based on the children
                var children = viewObj.model.children().models;

                for (var i = 0; i < children.length; i ++) {
                    var child = children[i];
                    var newCenterY = 0;
                    var newCenterX = 0;

                    var newCenterPoint = new GeoCore.Models.Point({x: this.model.get('centerPoint').x(), y: newCenterY});

                    if (child instanceof  SequenceD.Models.Processor) {
                        if (i > 0) {
                            newCenterY += children[i - 1].getHeight() + 30;
                        } else {
                            newCenterY += this.model.get('centerPoint').y() + 40;
                        }
                        var processorView = new SequenceD.Views.Processor({
                            model: child,
                            options: lifeLineOptions
                        });
                        processorView.render("#" + defaultView.options.diagram.wrapperId, newCenterPoint, "processors");
                    } else {

                        if (i > 0) {
                            newCenterY = this.model.get('centerPoint').y() + 40;
                            newCenterX = (children[i - 1]).get('centerPoint').x() + lifeLineOptions.rect.width + 30 + 30;
                            newCenterPoint = new GeoCore.Models.Point({x: newCenterX, y: newCenterY});
                        } else {
                            newCenterY = this.model.get('centerPoint').y() + 40;
                            newCenterX = startX + 30;
                            newCenterPoint = new GeoCore.Models.Point({x: newCenterX, y: newCenterY});
                        }

                        var lifeLineView = new SequenceD.Views.LifeLineView({
                            model: child,
                            options: lifeLineOptions
                        });
                        lifeLineView.options.line.height = 150;
                        lifeLineView.model.set('centerPoint', newCenterPoint);
                        lifeLineView.model.set("paperID", paperID);
                        lifeLineView.render("#" + this.options.diagram.wrapperId, "processors", "#ffffff");
                    }

                    child.set('centerPoint', newCenterPoint);
                }

                var regionHeight = this.model.getHeight();

                if (children.length > 30) {
                    var lastChild = children[children.length - 1];
                    var lowerY = viewObj.model.get('centerPoint').y() + viewObj.model.getHeight()/2;

                    if (lowerY - (lastChild.get('centerPoint').y() + lastChild.getHeight()/2) < 30) {
                        regionHeight = (lastChild.get('centerPoint').y() + lastChild.getHeight()/2) + 30;
                    }
                }
                this.model.setHeight(regionHeight);
                var rect = group.append("rect")
                    .attr("x", startX)
                    .attr("y", startY)
                    .attr("width", viewObj.model.getWidth())
                    .attr("height", regionHeight)
                    .attr("fill", "green")
                    .attr("opacity","0.01")
                    .attr("rx", 0)
                    .attr("ry", 0);

                rect.on('mouseover', function () {
                    d3.select(this)
                        .attr('opacity', 0.1)
                        .style('cursor', 'pointer');
                    //setting current tab view based diagram model
                    diagram = defaultView.model;
                    diagram.selectedNode = viewObj.model;
                    // Update event manager with current active element type for validation
                    eventManager.isActivated(diagram.selectedNode.attributes.title);
                });
                rect.on('mouseout', function () {
                    diagram.selectedNode = null;
                    d3.select(this).attr("opacity", 0.01);
                    // Update event manager with out of focus on active element
                    eventManager.isActivated("none");
                });
            }
        });

    views.MultiRegionProcessorView = MultiRegionProcessorView;
    views.MultiRegionHolderProcessorView = MultiRegionHolderProcessorView;
    views.ElementsRegionProcessorView = ElementsRegionProcessorView;

    return sequenced;

}(SequenceD || {}));
