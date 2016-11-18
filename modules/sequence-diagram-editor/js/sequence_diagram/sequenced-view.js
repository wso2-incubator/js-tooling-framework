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

    var Processor = Diagrams.Views.ShapeView.extend(
        /** @lends Processor.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class Processor Represents the view for processor components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, centerPoint, status) {
                if (status == "processors") {
                    Diagrams.Views.ShapeView.prototype.render.call(this, paperID);
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
                }
            },

            addEditableAndDeletable: function(d3Ref, optionsMenuGroup, processorTitleRect, center, height, width, viewObj){
                var optionMenuWrapper = d3Ref.draw.rect((center.x() + 10 + width/2),
                    (center.y()),
                    30,
                    58,
                    0,
                    0,
                    optionsMenuGroup, "#f8f8f3").
                attr("style", "stroke: #ede9dc; stroke-width: 1; opacity:0.5; cursor: pointer").
                on("mouseover", function () {
                    d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: .7; cursor: pointer");
                }).
                on("mouseout", function () {
                    d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                });

                var deleteOption = d3Ref.draw.rect((center.x() + 13 + width/2),
                    (center.y() + 3),
                    24,
                    24,
                    0,
                    0,
                    optionsMenuGroup, "url(#delIcon)").
                attr("style", "opacity:0.5; cursor: pointer").
                on("mouseover", function () {
                    d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 1; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: .7");
                }).
                on("mouseout", function () {
                    d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                });

                var editOption = d3Ref.draw.rect((center.x() + 13 + width/2),
                    (center.y() + 31),
                    24,
                    24,
                    0,
                    0,
                    optionsMenuGroup, "url(#editIcon)").
                attr("style", "opacity:0.5; cursor: pointer").
                on("mouseover", function () {
                    d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 1; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: .7; cursor: pointer");
                }).
                on("mouseout", function () {
                    d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                    optionMenuWrapper.attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                });

                // On click of the mediator show/hide the options menu
                processorTitleRect.on("click", function () {
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
                        defaultView.render();
                    }
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                });

                // On click of the edit icon will show the properties to to edit
                editOption.on("click", function () {
                    if (diagram.propertyWindow) {
                        diagram.propertyWindow = false;
                        defaultView.enableDragZoomOptions();
                        defaultView.render();

                    } else {
                        var options = {
                            x: parseFloat(this.getAttribute("x")) + 6,
                            y: parseFloat(this.getAttribute("y")) + 21
                        };

                        defaultView.selectedNode = viewObj.model;
                        defaultView.drawPropertiesPane(d3Ref, options,
                            viewObj.model.get('utils').getMyParameters(
                                viewObj.model),
                            viewObj.model.get('utils').getMyPropertyPaneSchema(
                                viewObj.model));
                    }
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                });

                // On click of the delete icon will delete the processor
                deleteOption.on("click", function () {
                    // Get the parent of the model and delete it from the parent
                    var parentModelChildren = viewObj.model.get("parent").get("children").models;
                    for (var itr = 0; itr < parentModelChildren.length; itr ++) {
                        if (parentModelChildren[itr].cid === viewObj.model.cid) {

                            parentModelChildren.splice(itr, 1);
                            defaultView.render();
                            break;
                        }
                    }
                });

                var getPropertyPaneSchema = function (model) {
                    return ;
                };

            },

        });

    var MessageLink = Diagrams.Views.DiagramElementView.extend(
        /** @lends Processor.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class Processor Represents the view for processor components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.DiagramElementView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, status) {
                if (status == "messages") {
                    Diagrams.Views.DiagramElementView.prototype.render.call(this, paperID);
                    var d3ref = this.getD3Ref();
                    var group = d3ref.draw.group();
                    var viewObj = this;
                    var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");
                    var destinationCenterPoint = this.model.destination().centerPoint();
                    var sourceCenterPoint = this.model.source().centerPoint();
                    var delXPosition = ((Math.round(sourceCenterPoint.get('x'))) +
                        Math.round(destinationCenterPoint.get('x')))/2;

                    var optionMenuWrapper = d3ref.draw.rect(Math.round(delXPosition) - 15,
                        Math.round(sourceCenterPoint.get('y')) + 10,
                        30,
                        30,
                        0,
                        0,
                        optionsMenuGroup, "#f9f7f4").
                        attr("style", "stroke: #908D82; stroke-width: 0.5; opacity:0.5; cursor: pointer").
                        on("mouseover", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .1; cursor: pointer");
                        }).
                        on("mouseout", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                        });

                    var deleteOption = d3ref.draw.rect(Math.round(delXPosition) - 12,
                        Math.round(sourceCenterPoint.get('y')) + 13,
                        24,
                        24,
                        0,
                        0,
                        optionsMenuGroup, "url(#delIcon)").
                        attr("style", "opacity:0.2; cursor: pointer; stroke: #ede9dc").
                        on("mouseover", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 1; cursor: pointer");
                            optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .7");
                        }).
                        on("mouseout", function () {
                            d3.select(this).attr("style", "stroke: #f9f7f4; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                            optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                        });

                    // When we have unequal y coordinates in source and destination message points, we need to set them to a common value
                    // as we need a horizontal line always. Here we will use priority point and set that y value to both points.
                    if(!_.isUndefined(this.model.priority())) {
                        sourceCenterPoint.y(this.model.priority().centerPoint().y());
                        destinationCenterPoint.y(this.model.priority().centerPoint().y());
                    }

                    if(this.model.type() === Diagrams.Utils.messageLinkType.InOut){
                        // Drawing an IN_OUT message.
                        var lineDestinationCenterPoint = createPoint(destinationCenterPoint.x(), Math.round(destinationCenterPoint.y()) -5);
                        var lineSourceCenterPoint = createPoint(sourceCenterPoint.x(), Math.round(sourceCenterPoint.y()) - 5);
                        var line = d3ref.draw.lineFromPoints(lineSourceCenterPoint, lineDestinationCenterPoint, group)
                            .classed(this.options.class, true);

                        var line2DestinationCenterPoint = createPoint(destinationCenterPoint.x(), Math.round(destinationCenterPoint.y()) + 10);
                        var line2SourceCenterPoint = createPoint(sourceCenterPoint.x(), Math.round(sourceCenterPoint.y()) + 10);

                        var line2 = d3ref.draw.lineFromPoints(line2DestinationCenterPoint, line2SourceCenterPoint, group)
                            .classed(this.options.class, true);
                    }else{
                        // Drawing an OUT_ONLY message.
                        var line = d3ref.draw.lineFromPoints(sourceCenterPoint, destinationCenterPoint, group)
                            .classed(this.options.class, true);
                    }

                    //this.model.source().on("connectingPointChanged", this.sourceMoved, this);
                    //this.model.destination().on("connectingPointChanged", this.destinationMoved, this);

                    line.on("click", function () {
                        if (optionsMenuGroup.classed("option-menu-hide")) {
                            optionsMenuGroup.classed("option-menu-hide", false);
                            optionsMenuGroup.classed("option-menu-show", true);
                        } else {
                            optionsMenuGroup.classed("option-menu-hide", true);
                            optionsMenuGroup.classed("option-menu-show", false);
                        }
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                    });

                    deleteOption.on("click", function () {
                        var model = viewObj.model;

                        var sourceLifeLineChildren = model.get('source').get('parent').get('children').models;
                        var destLifeLineChildren = model.get('destination').get('parent').get('children').models;

                        sourceLifeLineChildren.forEach(function (child) {
                            if (child.cid == model.get('sourcePoint').cid) {
                                sourceLifeLineChildren.splice(sourceLifeLineChildren.indexOf(child), 1);
                            }
                        });

                        destLifeLineChildren.forEach(function (child) {
                            if (child.cid == model.get('destinationPoint').cid) {
                                destLifeLineChildren.splice(destLifeLineChildren.indexOf(child), 1);
                            }
                        });

                        defaultView.render();
                    });

                    this.d3el = group;
                    this.el = group.node();
                    return this.d3el;
                }
            }

        });



    var MessageView = Diagrams.Views.LinkView.extend(
        /** @lends MessageView.prototype */
        {
            /**
             * @augments LinkView
             * @constructs
             * @class MessageView Represents the view for message components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.LinkView.prototype.initialize.call(this, options);
            },

            render: function (paperID) {
                // call super
                Diagrams.Views.LinkView.prototype.render.call(this, paperID);
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

                this.d3el.call(drag);
                return this.d3el;
            }
        });

    views.MessageView = MessageView;
    views.Processor = Processor;
    views.MessageLink = MessageLink;

    return sequenced;

}(SequenceD || {}));
