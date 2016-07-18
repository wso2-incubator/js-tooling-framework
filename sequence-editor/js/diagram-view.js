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
var Diagrams = (function (diagrams){

    var views = diagrams.Views || {};

    var DiagramElementView = Backbone.View.extend(
    /** @lends DiagramElementView.prototype */
    {
        /**
         * @augments DiagramElementView.View
         * @constructs
         * @class DiagramElementView Represents the view for elements in a diagram.
         * @param {Object} options Rendering options for the view
         */
        initialize: function(options) {
            _.extend(this, _.pick(options, "options"));
        },

        /**
         * Default drag move handler which will translate view by appending new offsets
         * to current translate element.
         * @param {d3.event} event D3 event object.
         */
        dragMove: function (event) {
            var d = this.modelAttr("dragData");
            d.x += this.horizontalDrag() ? event.dx : 0;
            d.y += this.verticalDrag() ? event.dy : 0;
            this.el.translate(d.x, d.y);
        },

        /**
         * Default drag start handler which captures original position
         * of the view.
         * @param {d3.event} event D3 event object.
         */
        dragStart: function (event) {
            if(this.modelAttr("dragData") === undefined){
                this.modelAttr("dragData", {x: this.horizontalDrag() ? event.dx : 0,
                    y: this.verticalDrag() ? event.dy :0});
            }
        },

        /**
         * Default empty drag stop handler. Extending views need to override
         * for custom behaviour.
         */
        dragStop: function () {
        },

        /**
         * Sets, un-sets or gets an attribute of underline model. If a value is not passed
         * gets the value of modelAttr. Otherwise, set the value of attribute.
         * if the passed value is null, un-set the attribute.
         *
         * @param {string} name Name of the model attribute.
         * @param {*} [value] Value of the model attribute.
         * @returns {*|void} Returns value if value is not passed. Else void.
         */
        modelAttr: function(name,value){
            if(value === undefined){
                return this.model.get(name);
            }
            if(name !== undefined){
                if(value !== null)
                {
                    var data = {};
                    data[name] = value;
                    this.model.set(data);
                }else{
                    this.model.unset(name);
                }
            }
        },

        /**
         * Checks whether this view supports horizontal drag.
         *
         * @returns {boolean}
         */
        horizontalDrag: function(){
            return true;
        },

        /**
         * Checks whether this view supports vertical drag.
         *
         * @returns {boolean}
         */
        verticalDrag: function(){
            return true;
        }
    });

    var ShapeView = DiagramElementView.extend(
        /** @lends ShapeView.prototype */
        {
            /**
             * @augments DiagramElementView.View
             * @constructs
             * @class ShapeView Represents the view for shapes in a diagram.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                _.extend(this, _.pick(options, "options"));
            }
        }
    );

    var LinkView = DiagramElementView.extend(
    /** @lends LinkView.prototype */
    {
        /**
         * @augments DiagramElementView.View
         * @constructs
         * @class LinkView Represents the view for links in a diagram.
         * @param {Object} options Rendering options for the view
         */
        initialize: function (options) {
            _.extend(this, _.pick(options, "options"));
        },
        // disable horizontal drag for links
        horizontalDrag: function(){
            return true;
        },

        sourceChanged: function(){
            this.el.attr({x1: this.model.source().x(), y1: this.model.source().y()});
        },

        destinationChange: function(){
            this.el.attr({x2: this.model.destination().x(), y2: this.model.destination().y()});
        },

        render: function (paperID) {
            // set paper
            this.modelAttr("paperID", paperID || this.modelAttr('paperID') );

            // wrap d3 with custom drawing apis
            var d3Draw = D3Utils.decorate(d3.select(this.modelAttr("paperID")));

            var line = d3Draw.draw.lineFromPoints(this.model.source(), this.model.destination())
                .classed(this.options.class, true);

            this.model.on({"change:start": this.sourceChanged, "change:destination": this.destinationChange}, this);

            this.el = line;
            return line;
        }

    });

    var DiagramView = Backbone.View.extend(
    /** @lends DiagramView.prototype */
    {
        /**
         * @augments Backbone.View
         * @constructs
         * @class DiagramView Represents the view for the diagram
         * @param {Object} options Rendering options for the view
         */
        initialize: function(options) {
            var opts = options || {};
            opts.selector = options.selector || ".editor";
            opts.canvas = options.canvas || {};
            opts.canvas.height = options;
            this.options = opts;
        },

        render: function(){
            var container = d3.select(this.options.selector);
            if(_.isUndefined(container)){
                throw  this.options.selector + " is not a valid query selector for container";
            }
            // wrap d3 with custom drawing apis
            container = D3Utils.decorate(container);

            //container.append("svg").ap


        }

    });

    views.DiagramElementView = DiagramElementView;
    views.ShapeView = ShapeView;
    views.LinkView = LinkView;
    views.DiagramView = DiagramView;

    diagrams.Views = views;
    return diagrams;
}(Diagrams || {}));