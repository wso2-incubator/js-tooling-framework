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
        initialize: function(options) {
            Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
        },

        handleDropEvent: function (event, ui) {
            console.log("dropped in to LifeLineView ")
        },

        verticalDrag: function(){
            return false;
        },

        thisModel:'',

        render: function (paperID) {
            Diagrams.Views.ShapeView.prototype.render.call(this, paperID);
            thisModel = this.model;
            var lifeLine = this.drawlifeLine(this.modelAttr('centerPoint'), this.modelAttr('title'), this.options);
            var viewObj = this;
            var drag = d3.drag()
                .on("start",function(){
                    viewObj.dragStart(d3.event);
                })
                .on("drag", function() {
                    viewObj.dragMove(d3.event);
                })
                .on("end",function(){
                    viewObj.dragStop();
                });

            lifeLine.call(drag);

            this.d3el = lifeLine;
            this.el = lifeLine.node();
            return lifeLine;
        },

        drawlifeLine: function (center, title, prefs) {
            var d3Ref = this.getD3Ref();
            var group = d3Ref.draw.group()
                .classed(prefs.class, true);
            var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 3, 3, group)
                .classed(prefs.rect.class, true);

            var middleRect = d3Ref.draw.centeredBasicRect(createPoint(center.get('x'), center.get('y') + prefs.rect.height/2 + prefs.line.height/2), prefs.middleRect.width, prefs.middleRect.height, 3, 3, group)
                .classed(prefs.middleRect.class, true);
            var rectBottom = d3Ref.draw.centeredRect(createPoint(center.get('x'), center.get('y') + prefs.line.height), prefs.rect.width, prefs.rect.height, 3, 3, group)
            .classed(prefs.rect.class, true);
            var line = d3Ref.draw.verticalLine(createPoint(center.get('x'), center.get('y')+ prefs.rect.height/2), prefs.line.height-prefs.rect.height, group)
            .classed(prefs.line.class, true);
            var text = d3Ref.draw.centeredText(center, title, group)
                .classed(prefs.text.class, true);
            var textBottom = d3Ref.draw.centeredText(createPoint(center.get('x'), center.get('y') + prefs.line.height), title, group)
                .classed(prefs.text.class, true);
            Object.getPrototypeOf(group).rect = rect;
            Object.getPrototypeOf(group).rectBottom = rectBottom;
            Object.getPrototypeOf(group).line = line;
            Object.getPrototypeOf(group).middleRect = middleRect;
            Object.getPrototypeOf(group).title = text;
            Object.getPrototypeOf(group).titleBottom = textBottom;
            Object.getPrototypeOf(group).translate = function(dx, dy){
                this.attr("transform", function(){
                    return "translate(" + [ dx, dy ] + ")"
                })
            };

            function showDeletebutton(svgObj, button){
                  var imgRight = svgObj.x.baseVal.value + svgObj.width.baseVal.value + 4 ;
                  var imgTop = svgObj.y.baseVal.value - svgObj.height.baseVal.value/2 - 4 ;
                  button.css({
                    position:'absolute',
                    top: imgTop,
                    left: imgRight,
                    zIndex:5000
                  });
                  button.removeClass("hidden-button");
                  button.addClass("visible-button");
            }

            function hideDeletebutton(svgObj, button){
                  button.removeClass("visible-button");
                  button.addClass("hidden-button");
            }

            var viewObj = this;
            middleRect.on('mouseover', function() {
                diagram.selectedNode = viewObj.model;
                d3.select(this).
                style("fill", "green").
                style("fill-opacity", 0.1);
            }).on('mouseout', function() {
                diagram.selectedNode = null;
                d3.select(this).
                style("fill-opacity", 0.01);
            }).on('mouseup',function(data){
            });

            rect.on("click", (function() {
                var deletebutton = $('#deletebutton'); //get the needed div
        		    if (selected){
                  if(this == selected) {
                      selected.classList.toggle("lifeline_selected");
                      hideDeletebutton(this, deletebutton);
                      selected='';
                  } else {
                      selected.classList.toggle("lifeline_selected");
          		      	this.classList.toggle("lifeline_selected");
                      showDeletebutton(this, deletebutton);
          		      	selected = this;
                      //Need to define a way on how to get the model by giving an ID
                      selectedModel = thisModel;
          		    }
        		    } else {
                  this.classList.toggle("lifeline_selected");
                  showDeletebutton(this, deletebutton);
                  selected = this;
                  selectedModel = thisModel;
                }


            }));

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
        initialize: function(options) {
            Diagrams.Views.LinkView.prototype.initialize.call(this,options);
        },

        render: function (paperID) {
            // call super
            Diagrams.Views.LinkView.prototype.render.call(this, paperID);
            var viewObj = this;
            var drag = d3.drag()
                .on("start",function(){
                    viewObj.dragStart(d3.event);
                })
                .on("drag", function() {
                    viewObj.dragMove(d3.event);
                })
                .on("end",function(){
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
        initialize: function(options) {
            Diagrams.Views.ConnectionPointView.prototype.initialize.call(this, options);
        },

        render: function (paperID) {
            // call super
            Diagrams.Views.ConnectionPointView.prototype.render.call(this, paperID);

        },

        getNextAvailableConnectionPoint: function(connectionPoint){
            if(!_.isEqual(this.model.connections.length, 0))
            {
                var yOffset = this.model.connections.length  * 50;
            }
            return _.cloneDeep(this.model.owner().get('centerPoint')).move(0, yOffset || 50);
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
                initialize: function(options) {
                    Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
                },

                verticalDrag: function(){
                    return false;
                },

                render: function (paperID) {
                    Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                    var lifeLine = this.drawFixedSizedMediator(this.modelAttr('centerPoint'), this.modelAttr('title'), this.options);
                    var viewObj = this;
                    var drag = d3.drag()
                        .on("start",function(){
                            viewObj.dragStart(d3.event);
                        })
                        .on("drag", function() {
                            viewObj.dragMove(d3.event);
                        })
                        .on("end",function(){
                            viewObj.dragStop();
                        });

                    lifeLine.call(drag);

                    this.d3el = lifeLine;
                    this.el = lifeLine.node();
                    return lifeLine;
                },

                drawFixedSizedMediator: function (center, title, prefs) {
                    var d3Ref = this.getD3Ref();
                    var group = d3Ref.draw.group()
                        .classed(prefs.class, true);
                    var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 3, 3, group)
                        .classed(prefs.rect.class, true);
                    //var rectBottom = d3Ref.draw.centeredRect(createPoint(center.get('x'), center.get('y') + prefs.line.height), prefs.rect.width, prefs.rect.height, 3, 3, group)
                    //.classed(prefs.rect.class, true);
                    //var line = d3Ref.draw.verticalLine(createPoint(center.get('x'), center.get('y')+ prefs.rect.height/2), prefs.line.height-prefs.rect.height, group)
                    //.classed(prefs.line.class, true);
                    var text = d3Ref.draw.centeredText(center, title, group)
                        .classed(prefs.text.class, true);
                    //var textBottom = d3Ref.draw.centeredText(createPoint(center.get('x'), center.get('y') + prefs.line.height), title, group)
                       // .classed(prefs.text.class, true);
                    Object.getPrototypeOf(group).rect = rect;
                    //Object.getPrototypeOf(group).rectBottom = rectBottom;
                    //Object.getPrototypeOf(group).line = line;
                    Object.getPrototypeOf(group).title = text;
                    //Object.getPrototypeOf(group).titleBottom = textBottom;
                    Object.getPrototypeOf(group).translate = function(dx, dy){
                        this.attr("transform", function(){
                            return "translate(" + [ dx, dy ] + ")"
                        })
                    };

                    rect.on("click", (function() {
        		    if (selected){
        		     	selected.classList.toggle("lifeline_selected");
        		    }
        		    if(this != selected) {
        		      	this.classList.toggle("lifeline_selected");
        		      	selected = this;
        		    }
                    }));

                    return group;
                }

            });

    views.MessageView = MessageView;
    views.ActivationView = ActivationView;
    views.LifeLineView = LifeLineView;
    views.FixedSizedMediatorView = FixedSizedMediatorView;
    return sequenced;

}(SequenceD || {}));
