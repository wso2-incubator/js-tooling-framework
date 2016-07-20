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
            Diagrams.Views.ShapeView.prototype.initialize(options);
        },

        verticalDrag: function(){
            return false;
        },

        render: function (paperID) {
            // set paper
            this.modelAttr("paperID", this.modelAttr("paperID") || paperID);

            // wrap d3 with custom drawing apis
            var d3Draw = D3Utils.decorate(d3.select(this.modelAttr("paperID")));
            var lifeLine = d3Draw.draw.lifeLine(this.modelAttr('centerPoint'), this.modelAttr('title'), this.options);
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

            this.el = lifeLine;
            return lifeLine;
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
            Diagrams.Views.LinkView.prototype.initialize(options);
        },

        render: function (paperID) {
            // call super
            Diagrams.Views.LinkView.prototype.render.call(this, paperID);
        }
    });

    views.MessageView = MessageView;
    views.LifeLineView = LifeLineView;
    return sequenced;

}(SequenceD || {}));
