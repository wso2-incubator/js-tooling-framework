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

        verticalDrag: function(){
            return false;
        },

        render: function (paperID) {
            Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

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
            var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 10, 10, group)
                .classed(prefs.rect.class, true);
            var line = d3Ref.draw.verticalLine(center, prefs.line.height, group)
                .classed(prefs.line.class, true);
            var text = d3Ref.draw.centeredText(center, title, group)
                .classed(prefs.text.class, true);
            Object.getPrototypeOf(group).rect = rect;
            Object.getPrototypeOf(group).line = line;
            Object.getPrototypeOf(group).title = text;
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

    views.MessageView = MessageView;
    views.ActivationView = ActivationView;
    views.LifeLineView = LifeLineView;
    return sequenced;

}(SequenceD || {}));
