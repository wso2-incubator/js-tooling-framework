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
    var toolPaletteWidth = 240;
    var imageHeight = 20;

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
                    var processor = this.drawProcessor(paperID, centerPoint, this.modelAttr('title'), this.options);
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

                    this.d3el = processor;
                    this.el = processor.node();
                    return processor;
                }
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

            addEditableAndDeletable: function(d3Ref, optionsMenuGroup, processorTitleRect, center, height, width, viewObj){
                var optionMenuWrapper = d3Ref.draw.rect((center.x() + 10 + width/2),
                    (center.y() - height/2),
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
                    (center.y() + 3 - height/2),
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
                    (center.y() + 31 - height/2),
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

            drawProcessor: function (paperID, center, title, prefs) {
                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group();
                var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");
                var viewObj = this;

                if (this.model.model.type === "UnitProcessor") {

                    var height = 0;
                    if (this.model.get('utils').outputs) {
                        height = this.model.getHeight();
                    } else {
                        height = this.model.getHeight() - 20;
                    }
                    var width = this.model.getWidth();

                    var orderedElements = [];

                    var processorTitleRect = d3Ref.draw.rect((center.x() - this.model.getWidth()/2),
                        (center.y() - height/2),
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
                        (center.y() + 15 - height/2),
                        title,
                        group)
                        .classed("mediator-title", true);
                    var inputText = d3Ref.draw.textElement(center.x() + 20 - this.model.getWidth()/2,
                        (center.y() + 35 - height/2),
                        this.generateInputOutputString(this.model.get('utils').getInputParams(this.model)),
                        group)
                        .classed("input-output-text", true);
                    var inputTri = d3Ref.draw.inputTriangle(center.x() + 5 - this.model.getWidth()/2,
                        (center.y() + 30 - height/2),
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

                } else if (this.model.model.type === "Action") {
                    // TODO: here, the processor model is Processor. But since we pass
                    // the model when we draw the lifeline's children,
                    // We can get various other types such as ActionProcessor, etc. We need to refactor this and it's a must
                    var processorView = new SequenceD.Views.ActionProcessorView({model: this.model,
                        options: lifeLineOptions});
                    processorView.render("#" + defaultView.options.diagram.wrapperId, center, viewObj.model, prefs);
                } else if (this.model.model.type === "DynamicContainableProcessor") {

                    console.log("Processor added");
                    var rectBottomXXX = d3Ref.draw.rectWithTitle(center,
                        60,
                        prefs.rect.height,
                        150,
                        200,
                        0,
                        0,
                        group,
                        this.modelAttr('viewAttributes').colour,
                        this.modelAttr('title')
                    );
                    console.log("started");
                    var middleRect = d3Ref.draw.centeredBasicRect(createPoint(center.x(),
                        center.y()+75), 150, 200 - prefs.rect.height, 0, 0, group);
                    middleRect.on("mousedown", function () {
                        var m = d3.mouse(this);
                        this.mouseDown(prefs, center.x(), m[1]);
                    }).on('mouseover', function () {
                        console.log("middle rect detected");
                        diagram.selectedNode = viewObj.model;
                        d3.select(this).style("fill", "green").style("fill-opacity", 0.1);
                    }).on('mouseout', function () {
                        diagram.destinationLifeLine = diagram.selectedNode;
                        diagram.selectedNode = null;
                        d3.select(this).style("fill-opacity", 0.01);
                    }).on('mouseup', function (data) {
                    });
                    console.log(middleRect);
                    group.rect = rectBottomXXX;
                    group.middleRect = middleRect;

                    var centerPoint = center;
                    var xValue = centerPoint.x();
                    var yValue = centerPoint.y();
                    //lifeLine.call(drag);
                    yValue += 60;
                    for (var id in this.modelAttr("children").models) {
                        var processor = this.modelAttr("children").models[id];
                        var processorView = new SequenceD.Views.Processor({model: processor, options: lifeLineOptions});
                        var processorCenterPoint = createPoint(xValue, yValue);
                        processorView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint, "processors");
                        processor.setY(yValue);
                        yValue += processor.getHeight()+ 30;
                    }


                } else if (this.model.model.type === "ComplexProcessor") {

                    console.log("Processor added");

                    var containableProcessorElementViewArray = [];


                    var centerPoint = center;
                    var xValue = centerPoint.x();
                    var yValue = centerPoint.y();

                    var totalHeight=0;
                    var maximumWidth = 150;

                    for (var id in this.modelAttr("containableProcessorElements").models) {

                        var containableProcessorElement = this.modelAttr("containableProcessorElements").models[id];
                        var containableProcessorElementView = new SequenceD.Views.ContainableProcessorElement({model: containableProcessorElement, options: lifeLineOptions});
                        var processorCenterPoint = createPoint(xValue, yValue);
                        var elemView = containableProcessorElementView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint);
                        containableProcessorElementViewArray.push(elemView);
                        yValue = yValue+containableProcessorElement.getHeight();
                        totalHeight+=containableProcessorElement.getHeight();
                        //yValue += 60;
                        //var processor = this.modelAttr("children").models[id];
                        //var processorView = new SequenceD.Views.Processor({model: processor, options:
                        // lifeLineOptions}); var processorCenterPoint = createPoint(xValue, yValue);
                        // processorView.render("#diagramWrapper", processorCenterPoint); processor.setY(yValue);

                        if(maximumWidth < containableProcessorElement.getWidth()){
                            maximumWidth = containableProcessorElement.getWidth();
                        }
                    }


                    var arrayLength = containableProcessorElementViewArray.length;
                    for (var i = 0; i < arrayLength; i++) {

                        var middleRect = containableProcessorElementViewArray[i].middleRect;
                        var rect = containableProcessorElementViewArray[i].rect;
                        var titleRect = containableProcessorElementViewArray[i].titleRect;
                        var text = containableProcessorElementViewArray[i].text;

                        var initWidth = middleRect.attr("width");
                        middleRect.attr("width", maximumWidth);
                        rect.attr("width", maximumWidth);

                        var deviation = (maximumWidth - initWidth)/2;

                        middleRect.attr("x", parseInt(middleRect.attr("x")) - deviation);
                        rect.attr("x", parseInt(rect.attr("x")) - deviation);
                        titleRect.attr("x", parseInt(titleRect.attr("x")) - deviation);
                        text.attr("x", parseInt(text.attr("x")) - deviation);

                    }

                    this.model.setHeight(totalHeight);
                    this.model.setWidth(maximumWidth);
                } else if(this.model.model.type === "CustomProcessor") {
                    if(!_.isUndefined(this.model.get('utils').init)){
                        this.viewRoot = group;
                        this.model.set('centerPoint', center);
                        this.model.get('utils').init(this, d3Ref);
                    }
                } else if (this.model.model.type === "MultiRegionHolderProcessor") {
                    var processor = this.model;
                    var processorView = new SequenceD.Views.MultiRegionHolderProcessorView({model: processor, options: lifeLineOptions});
                    processorView.render("#" + defaultView.options.diagram.wrapperId, center, "processors");
                }

                /*var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 3, 3, group)
                 .classed(prefs.rect.class, true);
                 var text = d3Ref.draw.centeredText(center, title, group)
                 .classed(prefs.text.class, true);*/

                Object.getPrototypeOf(group).translate = function (dx, dy) {
                    this.attr("transform", function () {
                        return "translate(" + [dx, dy] + ")"
                    })
                };

                return group;
            }

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
                    thisModel = this.model;
                    var centerPoint = this.modelAttr('centerPoint');
                    var lifeLine = this.drawLifeLine(centerPoint, this.modelAttr('title'), this.options, colour);
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
                    var xValue = centerPoint.x();
                    var yValue = centerPoint.y();

                    lifeLine.call(drag);
                    yValue += 60;

                    var initialHeight = parseInt(lifeLine.line.attr("y2")) - parseInt(lifeLine.line.attr("y1")) ;
                    var totalIncrementedHeight = 0;

                    for (var id in this.modelAttr("children").models) {

                        if (this.modelAttr("children").models[id] instanceof SequenceD.Models.Processor) {
                            if (_.isUndefined(this.modelAttr("children").models[id].get('skipOnLifelineDraw'))) {
                                var processor = this.modelAttr("children").models[id];
                                var processorView = new SequenceD.Views.Processor({
                                    model: processor,
                                    options: lifeLineOptions
                                });

                                var processorCenterPoint = createPoint(xValue, yValue);
                                processorView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint, "processors");
                                processor.setY(yValue);
                                yValue += processor.getHeight() + 30;
                                totalIncrementedHeight = totalIncrementedHeight + processor.getHeight() + 30;
                            }
                        } else {
                            var messagePoint = this.modelAttr("children").models[id];
                            var linkCenterPoint = createPoint(xValue, yValue);
                            //link.source.setY()
                            if (messagePoint.direction() == "outbound") {
                                if(!_.isUndefined(messagePoint.forceY) && _.isEqual(messagePoint.forceY, true)){
                                    yValue = messagePoint.y();
                                }
                                messagePoint.y(yValue);
                                messagePoint.x(xValue);
                            } else {
                                if(!_.isUndefined(messagePoint.forceY) && _.isEqual(messagePoint.forceY, true)){
                                    yValue = messagePoint.y();
                                }
                                var sourceY = messagePoint.message().source().y();
                                if (yValue < sourceY) {
                                    messagePoint.y(sourceY);
                                } else {
                                    messagePoint.y(yValue);
                                    messagePoint.message().source().y(yValue);
                                }
                                messagePoint.x(xValue);
                            }
                            yValue += 60;
                            totalIncrementedHeight = totalIncrementedHeight + 40;
                        }
                    }

                    var totalHeight = totalIncrementedHeight + initialHeight;
                    if (!_.isUndefined(diagram.highestLifeline) && diagram.highestLifeline !== null && diagram.highestLifeline.getHeight() > totalHeight) {
                        totalHeight = diagram.highestLifeline.getHeight();
                    }
                    this.model.setHeight(totalHeight);
                    this.adjustHeight(lifeLine, totalHeight - initialHeight);

                    if (diagram.highestLifeline == undefined || diagram.highestLifeline.getHeight() < this.model.getHeight()) {
                        diagram.highestLifeline = this.model;
                        defaultView.render();
                        return false;
                    }

                    //this.model.on("addChildProcessor", this.onAddChildProcessor, this);

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
                //lifeLine.drawMessageRect.attr("height", parseInt(lifeLine.drawMessageRect.attr("height")) + difference);
                lifeLine.middleRect.attr("height", parseInt(lifeLine.middleRect.attr("height")) + difference);

            },

            onAddChildProcessor: function (element, opts) {

                if (element instanceof SequenceD.Models.Processor) {

                    if (element.model.type === "UnitProcessor") {

                        var d3Ref = this.getD3Ref();
                        console.log("Processor added");
                        var rectBottomXXX = d3Ref.draw.centeredRect(
                            createPoint(defaultView.model.selectedNode.get('centerPoint').get('x'),
                                element.get('centerPoint').get('y')),
                            this.prefs.rect.width,
                            this.prefs.rect.height,
                            0,
                            0,
                            this.group, element.viewAttributes.colour
                        );
                        var mediatorText = d3Ref.draw.centeredText(
                            createPoint(defaultView.model.selectedNode.get('centerPoint').get('x'),
                                element.get('centerPoint').get('y')),
                            element.get('title'),
                            this.group)
                            .classed(this.prefs.text.class, true);
                        //this.renderViewForElement(element, opts);
                    } else if (element.model.type === "DynamicContainableProcessor") {
                        var d3Ref = this.getD3Ref();
                        console.log("Processor added");
                        var rectBottomXXX = d3Ref.draw.rectWithTitle(
                            createPoint(defaultView.model.selectedNode.get('centerPoint').get('x'),
                                element.get('centerPoint').get('y')),
                            60,
                            this.prefs.rect.height,
                            150,
                            200,
                            0,
                            0,
                            this.group, element.viewAttributes.colour,
                            element.attributes.title
                        );

                    } else if (element.model.type === "ComplexProcessor") {
                        var d3Ref = this.getD3Ref();
                        console.log("Processor added");
                        var rectBottomXXX = d3Ref.draw.rectWithTitle(
                            createPoint(defaultView.model.selectedNode.get('centerPoint').get('x'),
                                element.get('centerPoint').get('y')),
                            60,
                            this.prefs.rect.height,
                            150,
                            200,
                            0,
                            0,
                            this.group, element.viewAttributes.colour,
                            element.attributes.title
                        );

                    }

                } else if (element instanceof SequenceD.Models.Message) {
                    console.log("Message Link added !!!")
                    if (opts.direction == 'inbound') {
                        defaultView.model.addElement(element, opts);
                    }
                }

            },

            drawLifeLine: function (center, title, prefs, colour) {
                var d3Ref = this.getD3Ref();
                this.diagram = prefs.diagram;
                var viewObj = this;
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
                if(textModel.dynamicRectWidth() === undefined){
                    textModel.dynamicRectWidth(130);
                }

                lifeLineTopRectGroup.attr('style', 'cursor: pointer');

                if (viewObj.model.definition.shape == 'rect') {
                    topShape = d3Ref.draw.genericCenteredRect(center, prefs.rect.width + 30, prefs.rect.height,
                        0, 0, lifeLineTopRectGroup, '#FFFFFF', textModel)
                        .classed(prefs.rect.class, true).classed("genericR",true);
                } else if (viewObj.model.definition.shape == 'polygon') {
                    var points = "" + center.x() + "," + (center.y() + 30) +
                        " " + (center.x() + 35) + "," + center.y() +
                        " " + center.x() + "," + (center.y() - 30) +
                        " " + (center.x() - 35) + "," + center.y();
                    topShape = d3Ref.draw.polygon(points, lifeLineTopRectGroup, textModel, center);
                    topShape.classed(viewObj.model.definition.class, true);
                }

                 // get new center.x for dynamic updates
                var rw = textModel.dynamicRectWidth();
                var rx = textModel.dynamicRectX();
                var centerX = parseFloat(rw/2) + parseFloat(rx);

                var middleRect = d3Ref.draw.centeredBasicRect(createPoint(centerX,
                    center.get('y') + prefs.rect.height / 2 + prefs.line.height / 2),
                    prefs.middleRect.width, prefs.middleRect.height, 0, 0, group,textModel)
                    .classed(prefs.middleRect.class, true);
                middleRect.attr('style', 'cursor: pointer');

                    this.center.attributes.x = centerX;
/*                var drawMessageRect = d3Ref.draw.centeredBasicRect(createPoint(centerX,
                    center.get('y') + prefs.rect.height / 2 + prefs.line.height / 2),
                    (prefs.middleRect.width * 0.4), prefs.middleRect.height, 0, 0, group,textModel)
                    .on("mousedown", function () {
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        var m = d3.mouse(this);
                        prefs.diagram.clickedLifeLine = viewObj.model;
                        prefs.diagram.trigger("messageDrawStart", viewObj.model,
                            new GeoCore.Models.Point({'x': centerX, 'y': m[1]}));

                    });*/

                var line = d3Ref.draw.genericVerticalLine(createPoint(center.get('x'),
                    center.get('y') + prefs.rect.height / 2), prefs.line.height - prefs.rect.height, group,textModel)
                    .classed(prefs.line.class, true);
                var text = d3Ref.draw.genericCenteredText(center, title, lifeLineTopRectGroup,textModel)
                    .classed(prefs.text.class, true).classed("genericT",true);
                text.attr('style', 'cursor: pointer');
                var lifeLineBottomRectGroup = group.append("g");

                if (viewObj.model.definition.shape == 'rect') {
                    bottomShape = d3Ref.draw.genericCenteredRect(createPoint(center.get('x'),
                            center.get('y') + prefs.line.height), prefs.rect.width + 30,
                        prefs.rect.height, 0, 0, lifeLineBottomRectGroup,'',textModel)
                        .classed(prefs.rect.class, true).classed("genericR",true);
                } else if (viewObj.model.definition.shape == 'polygon') {
                    var points = "" + center.x() + "," + (center.get('y') + prefs.line.height + 30) +
                        " " + (center.x() + 35) + "," + (center.get('y') + prefs.line.height) +
                        " " + center.x() + "," + (center.get('y') + prefs.line.height - 30) +
                        " " + (center.x() - 35) + "," + (center.get('y') + prefs.line.height);
                    bottomShape = d3Ref.draw.polygon(points, lifeLineTopRectGroup, textModel, center);
                }

                var textBottom = d3Ref.draw.genericCenteredText(createPoint(center.get('x'),
                    center.get('y') + prefs.line.height), title, lifeLineBottomRectGroup,textModel)
                    .classed(prefs.text.class, true).classed("genericT",true);

                if (this.model.type == "EndPoint") {
                    topShape.classed("outer-dashed", true);
                    bottomShape.classed("outer-dashed", true);
                }

                group.topShape = topShape;
                group.bottomShape = bottomShape;
                group.line = line;
                group.middleRect = middleRect;
                //group.drawMessageRect = drawMessageRect;
                group.textBottom = textBottom;
                group.svgTitle = text;
                group.svgTitleBottom = textBottom;
                group.translate = function (dx, dy) {
                    this.attr("transform", function () {
                        return "translate(" + [dx, dy] + ")"
                    })
                };

                var optionMenuStartX = center.x() + 2 + (prefs.rect.width + 30)/2;
                var optionMenuStartY = center.y() - prefs.rect.height/2;
                var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");

                var optionMenuWrapper = d3Ref.draw.rect(optionMenuStartX + 8,
                    optionMenuStartY,
                    30,
                    58,
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

                var deleteOption = d3Ref.draw.rect(optionMenuStartX + 11,
                    optionMenuStartY + 3,
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

                var editOption = d3Ref.draw.rect(optionMenuStartX + 11,
                    optionMenuStartY + 31,
                    24,
                    24,
                    0,
                    0,
                    optionsMenuGroup, "url(#editIcon)").
                    attr("style", "opacity:0.2; cursor: pointer; stroke: #ede9dc").
                    on("mouseover", function () {
                        d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 1; cursor: pointer");
                        optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .7; cursor: pointer");
                    }).
                    on("mouseout", function () {
                        d3.select(this).attr("style", "stroke: #f9f7f4; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                        optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                    });

                var viewObj = this;
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

/*                drawMessageRect.on('mouseover', function () {
                    //setting current tab view based diagram model
                    diagram = defaultView.model;
                    diagram.selectedNode = viewObj.model;
                    d3.select(this).style("fill", "black").style("fill-opacity", 0.2)
                        .style("cursor", 'url(images/BlackHandwriting.cur), pointer');
                    // Update event manager with current active element type for validation
                    eventManager.isActivated(diagram.selectedNode.attributes.title);
                }).on('mouseout', function () {
                    d3.select(this).style("fill-opacity", 0.0);
                    // Update event manager with out of focus on active element
                    eventManager.isActivated("none");
                }).on('mouseup', function (data) {
                });*/

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
                        for (var itr = 0; itr < resourceElements.length; itr ++) {
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
                        for (var itr = 0; itr < endpointElements.length; itr ++) {
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
                        for (var itr = 0; itr < workerElements.length; itr ++) {
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
                        for (var itr = 0; itr < sourceElements.length; itr ++) {
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

                return group;
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

    var ActivationView = Diagrams.Views.ConnectionPointView.extend(
        /** @lends ConnectionPointView.prototype */
        {
            /**
             * @augments LinkView
             * @constructs
             * @class ActivationView Represents the view for activations in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ConnectionPointView.prototype.initialize.call(this, options);
            },

            render: function (paperID) {
                // call super
                Diagrams.Views.ConnectionPointView.prototype.render.call(this, paperID);

            },

            getNextAvailableConnectionPoint: function (connecion, x, y) {
                var nextYCoordinate = defaultView.model.deepestPointY + 50;
                var nextXCoordinate = this.model.owner().get('centerPoint').x();

                // TODO: Until the layout finalize we will be drawing the message without offsetting dynamically
                //if (_.isEqual(connecion.type(), "incoming")) {
                //    lifeLineOptions.diagram.deepestPointY = nextYCoordinate;
                //}
                return new GeoCore.Models.Point({'x': nextXCoordinate, 'y': defaultView.model.sourceLifeLineY});
            }
        });

    var FixedSizedMediatorView = Diagrams.Views.ShapeView.extend(
        /** @lends FixedSizedMediatorView.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class LifeLineView Represents the view for lifeline components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID) {
                Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                var lifeLine = this.drawFixedSizedMediator(this.modelAttr('centerPoint'), this.modelAttr('title'), this.options);
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

                //lifeLine.call(drag);

                this.d3el = lifeLine;
                this.el = lifeLine.node();
                return lifeLine;
            },

            drawFixedSizedMediator: function (center, title, prefs) {
                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group()
                    .classed(prefs.class, true);
                var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 0, 0, group)
                    .classed(prefs.rect.class, true);
                //var rectBottom = d3Ref.draw.centeredRect(createPoint(center.get('x'), center.get('y') +
                // prefs.line.height), prefs.rect.width, prefs.rect.height, 3, 3, group) .classed(prefs.rect.class,
                // true); var line = d3Ref.draw.verticalLine(createPoint(center.get('x'), center.get('y')+
                // prefs.rect.height/2), prefs.line.height-prefs.rect.height, group) .classed(prefs.line.class, true);
                var text = d3Ref.draw.centeredText(center, title, group)
                    .classed(prefs.text.class, true);
                //var textBottom = d3Ref.draw.centeredText(createPoint(center.get('x'), center.get('y') +
                // prefs.line.height), title, group) .classed(prefs.text.class, true);
                group.rect = rect;
                //Object.getPrototypeOf(group).rectBottom = rectBottom;
                //Object.getPrototypeOf(group).line = line;
                group.title = text;
                //Object.getPrototypeOf(group).titleBottom = textBottom;
                group.translate = function (dx, dy) {
                    this.attr("transform", function () {
                        return "translate(" + [dx, dy] + ")"
                    })
                };

                return group;
            }

        });



    var ContainableProcessorElement = Diagrams.Views.ShapeView.extend(
        /** @lends ContainableProcessorElement.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class LifeLineView Represents the view for lifeline components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, centerPoint) {
                var thisModel = this.model;
                Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                var unitProcessorElement = this.drawUnitProcessor(centerPoint, this.modelAttr('title'), this.options);
                var viewObj = this;

                this.d3el = unitProcessorElement;
                this.el = unitProcessorElement.node();
                return unitProcessorElement;
            },

            drawUnitProcessor: function (center, title, prefs) {

                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group()
                    .classed(prefs.class, true);
                var viewObj = this;
                //var deleteIconGroup = undefined;
                var path = undefined;
                var height = prefs.rect.height;
                var width = prefs.rect.width;


                var rectBottomXXX = d3Ref.draw.rectWithTitle(
                    center,
                    60,
                    prefs.rect.height,
                    150,
                    200,
                    0,
                    0,
                    d3Ref,
                    this.modelAttr('viewAttributes').colour,
                    this.modelAttr('title')
                );
                console.log("started");
                var height = (200 - prefs.rect.height);
                var middleRect = d3Ref.draw.centeredBasicRect(createPoint(center.x(),
                    center.y()+100), 150, height, 0, 0);
                middleRect.on('mouseover', function () {
                    defaultView.model.selectedNode = viewObj.model;
                }).on('mouseout', function () {
                    defaultView.model.destinationLifeLine = defaultView.model.selectedNode;
                    defaultView.model.selectedNode = null;
                }).on('mouseup', function (data) {
                });
                console.log(middleRect);

                rectBottomXXX.group.on('mouseover', function () {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    defaultView.model.selectedNode = viewObj.model;
                }).on('mouseout', function () {
                    defaultView.model.destinationLifeLine = defaultView.model.selectedNode;
                    defaultView.model.selectedNode = null;
                }).on('mouseup', function (data) {
                });
/*
                var drawMessageRect = d3Ref.draw.centeredBasicRect(createPoint(center.x(),
                        center.y()+100), (prefs.middleRect.width * 0.4), height, 0, 0, d3Ref)
                    .on("mousedown", function () {
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        var m = d3.mouse(this);

                        prefs.diagram.clickedLifeLine = viewObj.model;
                        prefs.diagram.trigger("messageDrawStart", viewObj.model,  new GeoCore.Models.Point({'x': center.x(), 'y': m[1]}));

                    }).on('mouseover', function () {
                        defaultView.model.selectedNode = viewObj.model;
                        d3.select(this).style("fill", "black").style("fill-opacity", 0.2)
                            .style("cursor", 'url(images/BlackHandwriting.cur), pointer');
                    }).on('mouseout', function () {
                        d3.select(this).style("fill-opacity", 0.0);
                    });*/

                group.middleRect = middleRect;
                //group.drawMessageRect = drawMessageRect;
                group.rect = rectBottomXXX.containerRect;
                group.titleRect = rectBottomXXX.titleRect;
                group.text = rectBottomXXX.text;

                var centerPoint = center;
                var xValue = centerPoint.x();
                var yValue = centerPoint.y();
                //lifeLine.call(drag);

                var totalHeight = 60;
                var totalWidth = 150;
                this.model.setHeight(30);

                var initWidth =rectBottomXXX.containerRect.attr("width");

                yValue += 60;
                for (var id in this.modelAttr("children").models) {
                    var processor = this.modelAttr("children").models[id];
                    var processorView = new SequenceD.Views.Processor({model: processor, options: lifeLineOptions});
                    //TODO : Please remove this if else with a proper implementation
                    if(processor.type == "messagePoint"){
                        yValue = yValue-20;
                    }
                    var processorCenterPoint = createPoint(xValue, yValue);

                    processorView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint, "processors");
                    processor.setY(yValue);
                    totalHeight = totalHeight + this.model.getHeight() + processor.getHeight();
                    yValue += processor.getHeight()+ 30;

                    if (this.model.widestChild == null || this.model.widestChild.getWidth() < processor.getWidth()) {
                        this.model.widestChild = processor;
                    }
                }

                if (this.model.widestChild != null) {
                    totalWidth = this.model.widestChild.getWidth() + 30;
                }

                var deviation = (totalWidth - initWidth)/2;

                rectBottomXXX.containerRect.attr("height", totalHeight);
                rectBottomXXX.containerRect.attr("width", totalWidth);
                rectBottomXXX.containerRect.attr("x", parseInt(rectBottomXXX.containerRect.attr("x")) - deviation);
                rectBottomXXX.titleRect.attr("x", parseInt(rectBottomXXX.titleRect.attr("x")) - deviation);
                rectBottomXXX.text.attr("x", parseInt(rectBottomXXX.text.attr("x")) - deviation);
                this.model.setHeight(totalHeight);
                this.model.setWidth(totalWidth);
                middleRect.attr("height", totalHeight-30);
                middleRect.attr("width", totalWidth);
                middleRect.attr("x", parseInt(middleRect.attr("x")) - deviation);
                //drawMessageRect.attr("height", totalHeight-30);

                if (viewObj.model.get("title") === "Try" || viewObj.model.get("title") === "If") {
                    var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");
                    var optionMenuStartX = center.x() + 80;
                    var optionMenuStartY = center.y() - prefs.rect.height/2;

                    var optionMenuWrapper = d3Ref.draw.rect(optionMenuStartX + 8,
                        optionMenuStartY,
                        30,
                        58,
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

                    var deleteOption = d3Ref.draw.rect(optionMenuStartX + 11,
                        optionMenuStartY + 3,
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

                    var editOption = d3Ref.draw.rect(optionMenuStartX + 11,
                        optionMenuStartY + 31,
                        24,
                        24,
                        0,
                        0,
                        optionsMenuGroup, "url(#editIcon)").
                        attr("style", "opacity:0.2; cursor: pointer; stroke: #ede9dc").
                        on("mouseover", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 1; cursor: pointer");
                            optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .7; cursor: pointer");
                        }).
                        on("mouseout", function () {
                            d3.select(this).attr("style", "stroke: #f9f7f4; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                            optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                        });

                    // On click of the mediator show/hide the delete icon
                    rectBottomXXX.group.on("click", function () {
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
                            if (diagram.propertyWindow) {
                                diagram.propertyWindow = false;
                                defaultView.enableDragZoomOptions();
                                defaultView.render();
                            }
                            diagram.selectedOptionsGroup = null;
                        }
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                    });

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

                            defaultView.selectedNode = viewObj.model.attributes.parent;
                            defaultView.drawPropertiesPane(d3Ref, options,
                                viewObj.model.get('parent').attributes.parameters,
                                viewObj.model.attributes.parent.get("utils").getMyPropertyPaneSchema());


                        }
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                    });

                    deleteOption.on("click", function () {
                        //Get the parent of the model and delete it from the parent
                        var parentModelChildren = viewObj.model.get("parent").get("parent").get("children").models;
                        for (var itr = 0; itr < parentModelChildren.length; itr ++) {
                            if (parentModelChildren[itr].cid === viewObj.model.get("parent").cid) {
                                parentModelChildren.splice(itr, 1);
                                defaultView.render();
                                break;
                            }
                        }
                    });

                    //group.remove();
                    //
                    //return newGroup;
                }

                return group;
            }

        });

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

    var ActionProcessorView = Diagrams.Views.ShapeView.extend(
        /** @lends ActionProcessorView.prototype */
        {
            /**
             * @augments ActionProcessorView
             * @constructs
             * @class ActionProcessorView Represents Actions such as "Start, etc"
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            render: function (paperID, center, parentModel, prefs) {
                var viewObj = this.model;
                var height = this.model.getHeight();
                var width = this.model.getWidth();
                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group();
                var title = this.model.get('title');

                var processorTitleRect = d3Ref.draw.rect((center.x() - width/2),
                    (center.y() - height/2),
                    width,
                    height,
                    0,
                    0,
                    group,
                    this.modelAttr('viewAttributes').colour);

                // We need connection staring point only for the processors which have outbound connections.
                if(!_.isUndefined(this.model.model.hasOutputConnection) && this.model.model.hasOutputConnection) {
                    var circle = d3Ref.draw.circle(center.x() + width/2, center.y(), height / 3, group, "#2c3e50");

                    circle.on("mousedown", function () {
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        var m = d3.mouse(this);
                        prefs.diagram.clickedLifeLine = parentModel;
                        prefs.diagram.trigger("messageDrawStart", parentModel,
                            new GeoCore.Models.Point({'x': center.x() + width/2, 'y': m[1]}));
                    }).on('mouseover', function () {
                        //setting current tab view based diagram model
                        diagram = defaultView.model;
                        diagram.selectedNode = parentModel;
                        d3.select(this).style("fill", "red").style("fill-opacity", 0.6)
                            .style("cursor", 'url(images/BlackHandwriting.cur), pointer');
                        // Update event manager with current active element type for validation
                        eventManager.isActivated(diagram.selectedNode.attributes.title);
                    }).on('mouseout', function () {
                        //diagram.destinationLifeLine = diagram.selectedNode;
                        diagram.selectedNode = null;
                        d3.select(this).style("fill-opacity", 0.01);
                        // Update event manager with out of focus on active element
                        eventManager.isActivated("none");
                    }).on('mouseup', function (data) {

                    });
                }

                var mediatorText = d3Ref.draw.textElement(center.x(),
                    center.y() + 5,
                    title,
                    group)
                    .attr('text-anchor','middle')
                    .classed("genericT",true);

                //We will add edit and delete buttons if we have set editable and deletable to true in the processor definition.
                // if(!_.isUndefined(this.model.model.editable) && !_.isUndefined(this.model.model.deletable)
                //     && this.model.model.editable && this.model.model.deletable) {
                //     this.addEditableAndDeletable(d3Ref, optionsMenuGroup, processorTitleRect, center, height, width, viewObj);
                // }

                group.rect = processorTitleRect;
                group.title = mediatorText;
                group.circle = circle;

                var inputMessagePoint = this.model.inputConnector();
                if(!_.isUndefined(inputMessagePoint)){
                    inputMessagePoint.x(center.x() - width/2);
                    inputMessagePoint.y(center.y());
                }

                var outputMessagePoint = this.model.outputConnector();
                if(!_.isUndefined(outputMessagePoint)){
                    outputMessagePoint.x(center.x() + width/2);
                    outputMessagePoint.y(center.y());
                }
            }

        });

    views.MessageView = MessageView;
    views.ActivationView = ActivationView;
    views.LifeLineView = LifeLineView;
    views.Processor = Processor;
    views.MessageLink = MessageLink;
    views.ContainableProcessorElement = ContainableProcessorElement;
    views.MultiRegionProcessorView = MultiRegionProcessorView;
    views.MultiRegionHolderProcessorView = MultiRegionHolderProcessorView;
    views.ElementsRegionProcessorView = ElementsRegionProcessorView;
    views.ActionProcessorView = ActionProcessorView;

    return sequenced;

}(SequenceD || {}));
