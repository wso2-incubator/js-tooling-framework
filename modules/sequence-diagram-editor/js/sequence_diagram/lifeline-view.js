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

    var LifeLineView = Diagrams.Views.ShapeView.extend(
        /** @lends LifeLineView.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class LifeLineView Represents the view for lifeline components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
                this.listenTo(this.model, 'change:title', this.renderTitle);
            },

            handleDropEvent: function (event, ui) {
            },

            verticalDrag: function () {
                return false;
            },
            horizontalDrag: function () {
                return false;
            },

            renderTitle: function () {
                if (this.d3el) {
                    this.d3el.svgTitle.text(this.model.attributes.title);
                    this.d3el.svgTitleBottom.text(this.model.attributes.title);
                }
            },

            render: function (paperID, status, colour) {
                if (status == "processors") {
                    Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                    var lifeLine = this.drawLifeLine(paperID, this, colour);
                    var viewObj = this;
                    var drag = d3.drag()
                        .on("start", function () {
                            viewObj.dragStart(d3.event);
                        })
                        .on("drag", function () {
                            viewObj.dragMove(d3.event);
                        })
                        .on("end", function () {
                            viewObj.dragStop();
                        });
                    lifeLine.call(drag);

                    var initialHeight = parseInt(lifeLine.line.attr("y2")) - parseInt(lifeLine.line.attr("y1"));
                    // Space between two processors
                    var distanceBetweenProcessors = 30;
                    // Distance from lifeline's center point to first processor.
                    var initDistance = 60;
                    var centerPoint = this.modelAttr('centerPoint');
                    var x = centerPoint.x();
                    var y = centerPoint.y();
                    y += initDistance;

                    var children = this.modelAttr("children").models;
                    for (var id in children) {
                        if (children[id] instanceof SequenceD.Models.Processor) {
                            if (_.isUndefined(children[id].get('skipOnLifelineDraw'))) {
                                var processor = children[id];
                                var processorCenterPoint = createPoint(x, y);
                                var processorView = new SequenceD.Views.ProcessorViewFactory(processorCenterPoint, processor);
                                processorView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint, processor, this.options);
                                processor.setY(y);
                                y += processor.getHeight() + distanceBetweenProcessors;
                            }
                        } else {
                            var messagePoint = children[id];
                            messagePoint.x(x);
                            messagePoint.y(messagePoint.message().source().y());
                        }
                    }

                    // Minimum length for a Lifeline
                    var minimumLength = 250;
                    var totalHeight = parseInt(y) - parseInt(lifeLine.line.attr("y1"));
                    if (totalHeight < minimumLength) {
                        totalHeight = minimumLength;
                    }
                    if (!_.isUndefined(diagram.highestLifeline) && diagram.highestLifeline !== null) {
                        if (diagram.highestLifeline.getHeight() > totalHeight) {
                            totalHeight = diagram.highestLifeline.getHeight();
                        }
                        var maxHeight = diagram.highestLifeline.getHeight();
                    }
                    this.model.setHeight(totalHeight);
                    this.adjustHeight(lifeLine, totalHeight - initialHeight);

                    if (diagram.highestLifeline == undefined || maxHeight < this.model.getHeight()) {
                        diagram.highestLifeline = this.model;
                        defaultView.render();
                        return false;
                    }

                    this.d3el = lifeLine;
                    this.el = lifeLine.node();
                    return lifeLine;
                } else if (status == "messages") {
                    for (var id in this.modelAttr("children").models) {
                        var messagePoint = this.modelAttr("children").models[id];
                        if ((messagePoint instanceof SequenceD.Models.MessagePoint)) {
                            var linkView = new SequenceD.Views.MessageLink({
                                model: messagePoint.message(),
                                options: {class: "message"}
                            });
                            linkView.render("#" + defaultView.options.diagram.wrapperId, "messages");
                        }
                    }
                }
            },

            adjustHeight: function (lifeLine, difference) {
                var t = 'translate(0,' + difference + ')';
                lifeLine.bottomShape.attr('transform', t);
                lifeLine.line.attr("y2", parseInt(lifeLine.line.attr("y2")) + difference);
                lifeLine.textBottom.attr("y", parseInt(lifeLine.textBottom.attr("y")) + difference);
                lifeLine.middleRect.attr("height", parseInt(lifeLine.middleRect.attr("height")) + difference);

            },

            drawLifeLine: function (paperID, view, colour) {

                var center = view.modelAttr('centerPoint');
                var title = view.modelAttr('title');
                var prefs = this.options;

                var d3Ref = this.getD3Ref(paperID);
                this.diagram = prefs.diagram;
                var viewObj = this;
                var middleRect;
                var line;
                var polygonYOffset = 30;
                var polygonXOffset = 35;
                var group = d3Ref.draw.group()
                    .classed(this.model.viewAttributes.class, true);
                var lifeLineTopRectGroup = group.append("g");
                var topShape;
                var bottomShape;
                this.group = group;
                this.prefs = prefs;
                this.center = center;
                this.title = title;

                var textModel = this.model.attributes.textModel;
                if (textModel.dynamicRectWidth() === undefined) {
                    textModel.dynamicRectWidth(130);
                }

                lifeLineTopRectGroup.attr('style', 'cursor: pointer');

                if (viewObj.model.definition.shape == 'rect') {
                    topShape = d3Ref.draw.genericCenteredRect(createPoint(center.get('x'),
                            center.get('y') - prefs.rect.height / 2), prefs.rect.width + 30, prefs.rect.height,
                        0, 0, lifeLineTopRectGroup, '#FFFFFF', textModel)
                        .classed(prefs.rect.class, true).classed("genericR", true);
                } else if (viewObj.model.definition.shape == 'polygon') {
                    var points = "" + center.x() + "," + (center.y() + polygonYOffset) +
                        " " + (center.x() + polygonXOffset) + "," + center.y() +
                        " " + center.x() + "," + (center.y() - polygonYOffset) +
                        " " + (center.x() - polygonXOffset) + "," + center.y();
                    topShape = d3Ref.draw.polygon(points, lifeLineTopRectGroup, textModel, center);
                    topShape.classed(viewObj.model.definition.class, true);
                }

                // get new center.x for dynamic updates
                var rw = textModel.dynamicRectWidth();
                var rx = textModel.dynamicRectX();
                var centerX = parseFloat(rw / 2) + parseFloat(rx);

                if (viewObj.model.definition.shape == 'rect') {
                    middleRect = d3Ref.draw.centeredBasicRect(createPoint(centerX,
                            center.get('y') + prefs.rect.height / 2),
                        prefs.middleRect.width, prefs.middleRect.height, 0, 0, group, textModel)
                        .classed(prefs.middleRect.class, true);
                    line = d3Ref.draw.genericVerticalLine(createPoint(center.get('x'),
                        center.get('y') + prefs.rect.height / 2), prefs.line.height - prefs.rect.height, group, textModel)
                        .classed(prefs.line.class, true);
                } else if (viewObj.model.definition.shape == 'polygon') {
                    var lenNew = prefs.line.height - 2 * polygonYOffset;
                    middleRect = d3Ref.draw.centeredBasicRect(createPoint(centerX,
                            center.get('y') + lenNew / 2 + polygonYOffset),
                        prefs.middleRect.width, lenNew, 0, 0, group, textModel)
                        .classed(prefs.middleRect.class, true);
                    line = d3Ref.draw.genericVerticalLine(createPoint(center.get('x'),
                        center.get('y') + polygonYOffset), lenNew, group, textModel)
                        .classed(prefs.line.class, true);
                }


                middleRect.attr('style', 'cursor: pointer');
                this.center.attributes.x = centerX;

                var text = d3Ref.draw.genericCenteredText(center, title, lifeLineTopRectGroup, textModel)
                    .classed(prefs.text.class, true).classed("genericT", true);
                text.attr('style', 'cursor: pointer');
                var lifeLineBottomRectGroup = group.append("g");

                if (viewObj.model.definition.shape == 'rect') {
                    bottomShape = d3Ref.draw.genericCenteredRect(createPoint(center.get('x'),
                            center.get('y') + prefs.line.height - prefs.rect.height / 2), prefs.rect.width + 30,
                        prefs.rect.height, 0, 0, lifeLineBottomRectGroup, '', textModel)
                        .classed(prefs.rect.class, true).classed("genericR", true);
                } else if (viewObj.model.definition.shape == 'polygon') {
                    var updatedTopShapePoints = "" + center.x() + "," + (center.y() + polygonYOffset) +
                        " " + (center.x() + polygonXOffset) + "," + center.y() +
                        " " + center.x() + "," + (center.y() - polygonYOffset) +
                        " " + (center.x() - polygonXOffset) + "," + center.y();
                    topShape.attr('points', updatedTopShapePoints);

                    var points = "" + center.x() + "," + (center.get('y') + prefs.line.height + 30) +
                        " " + (center.x() + 35) + "," + (center.get('y') + prefs.line.height) +
                        " " + center.x() + "," + (center.get('y') + prefs.line.height - 30) +
                        " " + (center.x() - 35) + "," + (center.get('y') + prefs.line.height);
                    bottomShape = d3Ref.draw.polygon(points, lifeLineTopRectGroup, textModel, center);
                }

                var textBottom = d3Ref.draw.genericCenteredText(createPoint(center.get('x'),
                    center.get('y') + prefs.line.height), title, lifeLineBottomRectGroup, textModel)
                    .classed(prefs.text.class, true).classed("genericT", true);

                if (this.model.type == "EndPoint") {
                    topShape.classed("outer-dashed", true);
                    bottomShape.classed("outer-dashed", true);
                }

                if (viewObj.model.definition.shape == 'rect') {
                    this.middleRectActivation(middleRect, this);
                }

                group.topShape = topShape;
                group.bottomShape = bottomShape;
                group.line = line;
                group.middleRect = middleRect;
                group.textBottom = textBottom;
                group.svgTitle = text;
                group.svgTitleBottom = textBottom;
                group.translate = function (dx, dy) {
                    this.attr("transform", function () {
                        return "translate(" + [dx, dy] + ")"
                    })
                };

                if (!_.isUndefined(this.model.definition.editable) && !_.isUndefined(this.model.definition.deletable) && this.model.definition.editable && this.model.definition.deletable) {
                    this.addEditableAndDeletable(d3Ref, center, prefs, group, lifeLineTopRectGroup);
                }
                return group;
            },

            addEditableAndDeletable: function (d3Ref, center, prefs, group, lifeLineTopRectGroup) {

                var optionMenuStartX = center.x() + 2 + (prefs.rect.width + 30) / 2;
                var optionMenuStartY = center.y() - prefs.rect.height / 2;
                var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");

                var optionMenuWrapper = d3Ref.draw.rect(optionMenuStartX + 8,
                    optionMenuStartY,
                    30,
                    58,
                    0,
                    0,
                    optionsMenuGroup, "#f9f7f4").attr("style", "stroke: #908D82; stroke-width: 0.5; opacity:0.5; cursor: pointer").on("mouseover", function () {
                    d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .1; cursor: pointer");
                }).on("mouseout", function () {
                    d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                });

                var deleteOption = d3Ref.draw.rect(optionMenuStartX + 11,
                    optionMenuStartY + 3,
                    24,
                    24,
                    0,
                    0,
                    optionsMenuGroup, "url(#delIcon)").attr("style", "opacity:0.2; cursor: pointer; stroke: #ede9dc").on("mouseover", function () {
                    d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 1; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .7");
                }).on("mouseout", function () {
                    d3.select(this).attr("style", "stroke: #f9f7f4; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                });

                var editOption = d3Ref.draw.rect(optionMenuStartX + 11,
                    optionMenuStartY + 31,
                    24,
                    24,
                    0,
                    0,
                    optionsMenuGroup, "url(#editIcon)").attr("style", "opacity:0.2; cursor: pointer; stroke: #ede9dc").on("mouseover", function () {
                    d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 1; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .7; cursor: pointer");
                }).on("mouseout", function () {
                    d3.select(this).attr("style", "stroke: #f9f7f4; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                });

                var viewObj = this;

                lifeLineTopRectGroup.on("click", (function () {
                    defaultView.model.selectedNode = viewObj.model;
                    if (optionsMenuGroup.classed("option-menu-hide")) {
                        optionsMenuGroup.classed("option-menu-hide", false);
                        optionsMenuGroup.classed("option-menu-show", true);

                        if (diagram.selectedOptionsGroup && (diagram.selectedOptionsGroup !== optionsMenuGroup)) {
                            diagram.selectedOptionsGroup.classed("option-menu-hide", true);
                            diagram.selectedOptionsGroup.classed("option-menu-show", false);
                        }
                        if (diagram.propertyWindow) {
                            diagram.propertyWindow = false;
                            defaultView.enableDragZoomOptions();
                            $('#property-pane-svg').empty();
                        }
                        diagram.selectedOptionsGroup = optionsMenuGroup;

                    } else {
                        optionsMenuGroup.classed("option-menu-hide", true);
                        optionsMenuGroup.classed("option-menu-show", false);
                        diagram.propertyWindow = false;
                        defaultView.enableDragZoomOptions();
                        diagram.selectedOptionsGroup = null;
                        defaultView.render();
                    }
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                }));

                editOption.on("click", function () {

                    if (diagram.propertyWindow) {
                        diagram.propertyWindow = false;
                        defaultView.enableDragZoomOptions();
                        defaultView.render();

                    } else {
                        diagram.selectedMainElementText = {
                            top: viewObj.d3el.svgTitle,
                            bottom: viewObj.d3el.svgTitleBottom
                        };

                        var options = {
                            x: parseFloat(this.getAttribute("x")) + 6,
                            y: parseFloat(this.getAttribute("y")) + 21
                        };

                        defaultView.selectedNode = viewObj.model;

                        defaultView.drawPropertiesPane(d3Ref, options,
                            viewObj.model.get("utils").getMyParameters(viewObj.model),
                            viewObj.model.get('utils').getMyPropertyPaneSchema(
                                viewObj.model));
                    }
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                });

                deleteOption.on("click", function () {
                    //Get the parent of the model and delete it from the parent
                    if (viewObj.model.type === "Resource") {
                        var resourceElements = defaultView.model.get("diagramResourceElements").models;
                        for (var itr = 0; itr < resourceElements.length; itr++) {
                            if (resourceElements[itr].cid === viewObj.model.cid) {
                                resourceElements.splice(itr, 1);
                                var currentResources = defaultView.model.resourceLifeLineCounter();
                                defaultView.model.resourceLifeLineCounter(currentResources - 1);
                                defaultView.model.get("diagramResourceElements").length -= 1;
                                defaultView.render();
                                break;
                            }
                        }
                    } else if (viewObj.model.type === "EndPoint") {
                        var endpointElements = defaultView.model.get("diagramEndpointElements").models;
                        for (var itr = 0; itr < endpointElements.length; itr++) {
                            if (endpointElements[itr].cid === viewObj.model.cid) {
                                endpointElements.splice(itr, 1);
                                var currentEndpoints = defaultView.model.endpointLifeLineCounter();
                                defaultView.model.endpointLifeLineCounter(currentEndpoints - 1);
                                defaultView.model.get("diagramEndpointElements").length -= 1;
                                defaultView.render();
                                break;
                            }
                        }
                    } else if (viewObj.model.type === "Worker") {
                        var workerElements = defaultView.model.get("diagramWorkerElements").models;
                        for (var itr = 0; itr < workerElements.length; itr++) {
                            if (workerElements[itr].cid === viewObj.model.cid) {
                                workerElements.splice(itr, 1);
                                var currentWorkers = defaultView.model.workerLifeLineCounter();
                                defaultView.model.workerLifeLineCounter(currentWorkers - 1);
                                defaultView.model.get("diagramWorkerElements").length -= 1;
                                defaultView.render();
                                break;
                            }
                        }
                    } else if (viewObj.model.type === "Source") {
                        var sourceElements = defaultView.model.get("diagramSourceElements").models;
                        for (var itr = 0; itr < sourceElements.length; itr++) {
                            if (sourceElements[itr].cid === viewObj.model.cid) {
                                sourceElements.splice(itr, 1);
                                var currentSources = defaultView.model.sourceLifeLineCounter();
                                defaultView.model.sourceLifeLineCounter(currentSources - 1);
                                defaultView.model.get("diagramSourceElements").length -= 1;
                                defaultView.render();
                                break;
                            }
                        }
                    }
                });
            },

            middleRectActivation : function (middleRect, viewObj) {
                middleRect.on('mouseover', function () {
                    //setting current tab view based diagram model
                    diagram = defaultView.model;
                    diagram.selectedNode = viewObj.model;
                    d3.select(this).style("fill", "green").style("fill-opacity", 0.1);
                    // Update event manager with current active element type for validation
                    eventManager.isActivated(diagram.selectedNode.attributes.title);
                }).on('mouseout', function () {
                    diagram.destinationLifeLine = diagram.selectedNode;
                    diagram.selectedNode = null;
                    d3.select(this).style("fill-opacity", 0.01);
                    // Update event manager with out of focus on active element
                    eventManager.isActivated("none");
                }).on('mouseup', function (data) {

                });
            }

        });

    views.LifeLineView = LifeLineView;

    return sequenced;

}(SequenceD || {}));
