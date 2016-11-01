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

var Processors = (function (processors) {

    var manipulators = processors.manipulators || {};

    //Payload Factory mediator definition
    var joinProcessor = {
        id: "JoinProcessor",
        title: "Join",
        icon: "images/tool-icons/join.svg",
        colour : "#27ae60",
        type : "CustomProcessor",
        dragCursorOffset : { left: 50, top: -5 },
        createCloneCallback : function(view){
            function cloneCallBack() {
                var div = view.createContainerForDraggable();
                d3.xml("images/tool-icons/datamapper_drag.svg").mimeType("image/svg+xml").get(function(error, xml) {
                    if (error) throw error;
                    var svg = xml.getElementsByTagName("svg")[0];
                    d3.select(svg).attr("width", "100px").attr("height", "140px");
                    div.node().appendChild(svg);
                });
                return div.node();
            }
            return cloneCallBack;
        },
        parameters: [
            {
                key: "joins",
                value: "1"
            }
        ],
        propertyPaneSchema: [
            {
                key: "joins",
                text: "Add Joins"
            }
        ],
        utils: {
            getMySubTree: function (model) {
                return new TreeNode("joinProcessor", "joinProcessor", "joinProcessor {", "}");
            },

            canConnectTo: function () {
                return [];
            },

            canConnectFrom: function () {
                return ['Worker'];
            },

            getMyPropertyPaneSchema : function () {
                return Processors.manipulators.JoinProcessor.propertyPaneSchema;
            },
            getMyParameters: function (model) {
                return [
                    {
                        key: "add",
                        value: model.attributes.parameters[0].value
                    }
                ];
            },
            saveMyProperties: function (model, inputs) {
                model.attributes.parameters = [
                    {
                        key: "joins",
                        value: inputs.joins.value
                    }
                ];
            },

            init: function (view, d3Ref) {
                if (!_.isUndefined(view.viewRoot)) {
                    var center = view.model.get('centerPoint');
                    var processorW = 24;
                    var defaultProcessorH = 100;
                    var defaultJoins = 2;
                    var joinCircleOffset = 30;

                    // Check for the initial mediator drop.If so we need only the default number of joins
                    if (_.isUndefined(view.model.get('joins'))) {
                        view.model.set('joins', defaultJoins);
                        view.model.set('processorH', defaultProcessorH);
                    }
                    // If add new join button is clicked then the number of joins will be changed and the join processor height
                    // will be changed at addMoreRect.on('click') event and the property addNewJoin is set to true
                    else if (view.model.get('addNewJoin')) {
                        view.model.set('addNewJoin', false);
                    }

                    // Otherwise we wll need to check the number of children in the array (Since in the message delete,
                    // re render the diagram) and determine the number of join circles to draw
                    else {
                        if (view.model.get('children').models.length > defaultJoins) {
                            view.model.set('joins', view.model.get('children').models.length);
                            view.model.set('processorH', defaultProcessorH +
                                (view.model.get('children').models.length - defaultJoins) * joinCircleOffset);
                        } else {
                            view.model.set('joins', defaultJoins);
                            view.model.set('processorH', defaultProcessorH);
                        }
                    }
                    view.model.setHeight(view.model.get('processorH'));
                    view.model.setWidth(processorW);

                    var joinRect = d3Ref.draw.centeredRect(center, processorW, view.model.get('processorH'), 0, 0,
                        view.viewRoot, "#FFFFFF");
                    var addMoreRect = d3Ref.draw.rect(center.x() - processorW/2, center.y() + view.model.get('processorH')/2 - 24,
                        processorW, 24, 0, 0, view.viewRoot, "url(#addIcon)");
                    joinRect.on('mouseover', function () {
                        defaultView.model.selectedNode = view.model;
                    }).on('mouseout', function () {
                        if(_.isEqual(defaultView.model.selectedNode, view.model)){
                            defaultView.model.destinationLifeLine = null;
                            defaultView.model.destinationProcessor = view.model;
                            defaultView.model.selectedNode = null;
                        }
                    });

                    var triStartX = center.x() + processorW/2;
                    var triStartY = center.y() - view.model.get('processorH')/2;
                    var points = "" + triStartX + "," + triStartY + " " + (triStartX - 5) + "," + (triStartY + 5) + " " + triStartX + "," + (triStartY + 10);

                    // If there are joins children already, then change the y coordinates
                    if(view.model.get('children').models.length > 0) {
                        for (var itr = 0; itr < view.model.get('children').models.length; itr ++) {
                            view.model.get('children').models[itr].setY(triStartY + joinCircleOffset*(itr + 1));
                        }
                    }
                    var joinPolyLine =  view.viewRoot.append("polyline")
                        .attr("points", points);

                    for (var x = 0; x < view.model.get('joins'); x ++) {
                        var circle = this.drawJoinStarts(center.x(), triStartY + joinCircleOffset*(x + 1), 5, view, d3Ref);
                        circle.attr('fill', "grey");
                    }

                    var optionMenuStartX = center.x() + 2 + (processorW)/2;
                    var optionMenuStartY = center.y() - view.model.get('processorH')/2;
                    var optionsMenuGroup = view.viewRoot.append("g").attr("class", "option-menu option-menu-hide");

                    var optionMenuWrapper = d3Ref.draw.rect(optionMenuStartX + 8,
                        optionMenuStartY,
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

                    var deleteOption = d3Ref.draw.rect(optionMenuStartX + 11,
                        optionMenuStartY + 3,
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

                    //var editOption = d3Ref.draw.rect(optionMenuStartX + 11,
                    //    optionMenuStartY + 32,
                    //    24,
                    //    24,
                    //    0,
                    //    0,
                    //    optionsMenuGroup, "url(#editIcon)").
                    //    attr("style", "opacity:0.5; cursor: pointer").
                    //    on("mouseover", function () {
                    //        d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 1; cursor: pointer");
                    //        optionMenuWrapper.attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: .7; cursor: pointer");
                    //    }).
                    //    on("mouseout", function () {
                    //        d3.select(this).attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                    //        optionMenuWrapper.attr("style", "stroke: #ede9dc; stroke-width: 1; opacity: 0.5; cursor: pointer");
                    //    });

                    joinRect.on('click', function () {
                        defaultView.model.selectedNode = view.model;
                        if (optionsMenuGroup.classed("option-menu-hide")) {
                            optionsMenuGroup.classed("option-menu-hide", false);
                            optionsMenuGroup.classed("option-menu-show", true);

                            if (diagram.selectedOptionsGroup) {
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
                    });

                    //editOption.on("click", function () {
                    //
                    //    if (diagram.propertyWindow) {
                    //        diagram.propertyWindow = false;
                    //        defaultView.enableDragZoomOptions();
                    //        defaultView.render();
                    //
                    //    } else {
                    //        diagram.selectedMainElementText = {
                    //            top: view.d3el.svgTitle,
                    //            bottom: view.d3el.svgTitleBottom
                    //        };
                    //
                    //        var options = {
                    //            x: parseFloat(this.getAttribute("x")) + 6,
                    //            y: parseFloat(this.getAttribute("y")) + 21
                    //        };
                    //
                    //        defaultView.selectedNode = view.model;
                    //
                    //        defaultView.drawPropertiesPane(d3Ref, options,
                    //            view.model.get("utils").getMyParameters(view.model),
                    //            view.model.get('utils').getMyPropertyPaneSchema(
                    //                view.model));
                    //    }
                    //});

                    //deleteOption.on("click", function () {
                    //    //Get the parent of the model and delete it from the parent
                    //    if (~view.model.get("title").indexOf("Resource")) {
                    //        var resourceElements = defaultView.model.get("diagramResourceElements").models;
                    //        for (var itr = 0; itr < resourceElements.length; itr ++) {
                    //            if (resourceElements[itr].cid === view.model.cid) {
                    //                resourceElements.splice(itr, 1);
                    //                var currentResources = defaultView.model.resourceLifeLineCounter();
                    //                defaultView.model.resourceLifeLineCounter(currentResources - 1);
                    //                defaultView.model.get("diagramResourceElements").length -= 1;
                    //                defaultView.render();
                    //                break;
                    //            }
                    //        }
                    //    } else {
                    //        var endpointElements = defaultView.model.get("diagramEndpointElements").models;
                    //        for (var itr = 0; itr < endpointElements.length; itr ++) {
                    //            if (endpointElements[itr].cid === view.model.cid) {
                    //                endpointElements.splice(itr, 1);
                    //                var currentEndpoints = defaultView.model.endpointLifeLineCounter();
                    //                defaultView.model.endpointLifeLineCounter(currentEndpoints - 1);
                    //                defaultView.model.get("diagramEndpointElements").length -= 1;
                    //                defaultView.render();
                    //                break;
                    //            }
                    //        }
                    //    }
                    //});

                    var viewObj = view;

                    addMoreRect.on('click', function () {
                        viewObj.model.set('joins', viewObj.model.get('joins') + 1);
                        view.model.set('processorH', view.model.get('processorH') + joinCircleOffset);
                        view.model.set('addNewJoin', true);
                        defaultView.render();
                    });

                }
            },

            drawJoinStarts: function (x, y, r, view, d3Ref) {
                var circle = d3Ref.draw.circle(x, y, r, view.viewRoot);
                var startPoint = createPoint(x, y);
                circle.on('mousedown', function () {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    defaultView.model.trigger("messageDrawStart", view.model, startPoint);
                });
                circle.on('mouseover', function () {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    d3.select(this).style("cursor", 'url(images/BlackHandwriting.cur), pointer');
                });

                return circle;
            }
        }

    };

    // Add defined mediators to manipulators
    // Mediator id should be exactly match to name defining here.(Eg : "LogMediator")
    manipulators.JoinProcessor = joinProcessor;

    processors.manipulators = manipulators;

    return processors;

}(Processors || {}));
