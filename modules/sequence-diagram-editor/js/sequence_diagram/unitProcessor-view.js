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

    var UnitProcessorView = Diagrams.Views.ShapeView.extend(
        /** @lends UnitProcessorView.prototype */
        {
            /**
             * @augments ProcessorView
             * @constructs
             * @class UnitProcessorView Represents the view for UnitProcessor(Eg: logger, header etc.) components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options, title) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
                this.title = title;
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, center, parentModel, prefs) {

                var d3Ref = this.getD3Ref(paperID);
                var group = d3Ref.draw.group();
                var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");
                var viewObj = this;

                var height = 0;
                if (this.model.get('utils').outputs) {
                    height = this.model.getHeight() + 20;
                } else {
                    height = this.model.getHeight();
                }
                var width = this.model.getWidth();

                var orderedElements = [];

                var processorTitleRect = d3Ref.draw.rect((center.x() - this.model.getWidth()/2),
                    (center.y()),
                    this.model.getWidth(),
                    20,
                    0,
                    0,
                    group,
                    this.modelAttr('viewAttributes').colour
                );

                var rectBottomXXX = d3Ref.draw.centeredRect(center,
                    this.model.getWidth(),
                    height,//prefs.rect.height,
                    0,
                    0,
                    group, //element.viewAttributes.colour
                    this.modelAttr('viewAttributes').colour
                );

                this.addEditableAndDeletable(d3Ref, optionsMenuGroup, processorTitleRect, center, height, width, viewObj);

                var mediatorText = d3Ref.draw.textElement(center.x(),
                    (center.y() + 15 ),
                    this.title,
                    group)
                    .classed("mediator-title", true);
                var inputText = d3Ref.draw.textElement(center.x() + 20 - this.model.getWidth()/2,
                    (center.y() + 35),
                    this.generateInputOutputString(this.model.get('utils').getInputParams(this.model)),
                    group)
                    .classed("input-output-text", true);
                var inputTri = d3Ref.draw.inputTriangle(center.x() + 5 - this.model.getWidth()/2,
                    (center.y() + 30),
                    group);

                //this.generateInputOutputString(this.model.get('utils').utils.getInputParams());

                if (this.model.get('utils').outputs) {
                    var outputText = d3Ref.draw.textElement(center.x() + 20 - this.model.getWidth()/2,
                        (center.y() + 58 - this.model.getHeight()/2),
                        this.generateInputOutputString(this.model.get('utils').getOutputParams()),
                        group)
                        .classed("input-output-text", true);
                    var outputTri = d3Ref.draw.outputTriangle(center.x() + 5 - this.model.getWidth()/2,
                        (center.y() + 53 - this.model.getHeight()/2),
                        group);
                    var dashedSeparator =d3Ref.draw.dashedLine(
                        center.x() - this.model.getWidth()/2,
                        center.y() + 10,
                        center.x() + this.model.getWidth()/2,
                        center.y() + 10,
                        "black",
                        group
                    );

                    orderedElements = [rectBottomXXX,
                        processorTitleRect,
                        mediatorText,
                        inputText,
                        outputText,
                        inputTri,
                        outputTri,
                        dashedSeparator,
                        optionsMenuGroup
                    ];
                } else {
                    orderedElements = [rectBottomXXX,
                        processorTitleRect,
                        mediatorText,
                        inputText,
                        inputTri,
                        optionsMenuGroup
                    ];
                }

                group.rect = rectBottomXXX;
                group.title = mediatorText;

                var newGroup = d3Ref.draw.regroup(orderedElements);
                group.remove();

                group.rect = rectBottomXXX;
                group.title = mediatorText;
                //this.renderViewForElement(element, opts);
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
                    var parentModel = viewObj.model.get("parent");
                    var parentModelChildren = parentModel.get("children").models;
                    //Get diagram highest height
                    var highestHeight = diagram.highestLifeline.getHeight();
                    for (var itr = 0; itr < parentModelChildren.length; itr ++) {
                        if (parentModelChildren[itr].cid === viewObj.model.cid) {
                            //reset parent height
                            var currentElementHeight = parentModelChildren[itr].getHeight();
                            parentModel.setHeight(parentModel.getHeight() - currentElementHeight);
                            var parentElement = parentModel;
                            //Find the Resource and adjust height
                            while(!(parentElement instanceof SequenceD.Models.LifeLine)){
                                parentElement = parentElement.get("parent")
                            }
                            // save current life-line height
                            var lifelineHeight = parentElement.getHeight();
                            parentModelChildren.splice(itr, 1);
                            if(lifelineHeight + currentElementHeight >= highestHeight){
                                diagram.highestLifeline.setHeight(highestHeight - currentElementHeight);
                            }
                            defaultView.render();
                            break;
                        }
                    }
                });


                var getPropertyPaneSchema = function (model) {
                    return ;
                };

            },

            generateInputOutputString: function (params) {
                var line = "";
                for (var x = 0; x < params.length; x++) {
                    line += params[x].value;
                    if (x < params.length - 1) {
                        line += ", ";
                    }
                }

                if (line.length > 20) {
                    line = line.substring(0, 15) + " ...";
                }
                return line;
            },

            generateInputOutputString: function (params) {
                var line = "";
                for (var x = 0; x < params.length; x++) {
                    line += params[x].value;
                    if (x < params.length - 1) {
                        line += ", ";
                    }
                }

                if (line.length > 20) {
                    line = line.substring(0, 15) + " ...";
                }
                return line;
            },

        });

    views.UnitProcessorView = UnitProcessorView;

    return sequenced;

}(SequenceD || {}));
