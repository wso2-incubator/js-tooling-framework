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

var Tools = (function (tools) {
    var views = tools.Views || {};

    var toolView = Backbone.View.extend({

        toolTemplate: _.template(" <div id=\"<%=toolId%>\" class=\"tool-container\"> <img src=\"<%=toolImage%>\" class=\"tool-image\"  /></div>"),
        
        handleDragStopEvent: function (event, ui) {
            console.log("handleDragStopEvent");
        },

        initialize: function () {
        },

        render: function () {
            this.$el.html(this.toolTemplate(this.model.attributes));

            var viewObj = this;

       /*     var drag = d3.drag()
                .on("start",function(){
                   console.log("Drag Start initialized" + this);
                })
                .on("drag", function() {
                    console.log("Dragging initialized" + this);
                })
                .on("end",function(){
                 relCoords = d3.mouse($('svg').get(0));
                var id = viewObj.model.attributes.toolId;
                if(id == "log-mediator"){

                if(diagram.selectedNode == null){
                }else{

                var log = createFixedSizedMediator("Log Mediator", createPoint(diagram.selectedNode.get('centerPoint').get('x'), relCoords[1]));
                                                diagram.addElement(log, lifeLineOptions);

                }

                }else if(id == "tool1"){
                var lifeline = createLifeLine("Lifeline", createPoint(relCoords[0]-240, 50));
                diagram.addElement(lifeline, lifeLineOptions);
                }else{

                }

                });

            var svg = d3.select(".toolpalatteClass").append("svg")
                .attr("width", 100)
                .attr("height", 30);

            var g = svg.append("g");

            g.append("rect")
                .attr("rx", 6)
                .attr("ry", 6)
                .attr("x", -12.5)
                .attr("y", -12.5)
                .attr("width", 25)
                .attr("height", 25)
                .attr("fill", "red")
                .call(drag);

                */

//this.$el.html(svg);

            this.$el.draggable({
                helper: 'clone',
                cursor: 'move',
                stop: this.handleDragStopEvent
            });
            return this;
        }
    });

    views.ToolView = toolView;
    tools.Views = views;
    return tools;

} (Tools || {}));
