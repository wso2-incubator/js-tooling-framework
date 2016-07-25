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
            var dx= this.horizontalDrag() ? event.dx : 0;
            var dy= this.verticalDrag() ? event.dy : 0;
            d.x += dx;
            d.y += dy;
            this.d3el.translate(d.x, d.y);
            this.model.trigger("elementMoved", {dx: dx, dy: dy});
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
        },

        render: function(paperID){
            this.modelAttr("paperID", this.modelAttr("paperID") || paperID);
        },

        /**
         * Returns wrapped D3 reference for drawing in paper.
         *
         * @param paperSelector
         * @returns {*}
         */
        getD3Ref: function (paperSelector) {
            if (_.isUndefined(paperSelector)) {
                var paperID = this.modelAttr("paperID");
                if (_.isUndefined(paperID)) {
                    throw "Paper is not defined for rendering svg.";
                }
            }
            return D3Utils.decorate(d3.select(paperSelector || this.modelAttr("paperID")))
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
                DiagramElementView.prototype.initialize.call(this, options);
            },

            render: function(paperID){
                DiagramElementView.prototype.render.call(this, paperID);
                this.model.on("connectionPointAdded", this.onConnectionPointAdded, this);
            },

            onConnectionPointAdded: function(connectionPoint){
                var view = Diagrams.Utils.createViewForModel(connectionPoint, {});
                view.render(this.modelAttr("paperID"));
            }
        }
    );

    var ConnectionView = DiagramElementView.extend(
    /** @lends ConnectionView.prototype */
    {
            /**
             * @augments DiagramElementView.View
             * @constructs
             * @class ConnectionView Represents the view for connections in a diagram.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                DiagramElementView.prototype.initialize.call(this, options);
            },

            render: function(paperID){
                DiagramElementView.prototype.render.call(this, paperID);
            }
    });

    var ConnectionPointView = DiagramElementView.extend(
    /** @lends ConnectionPointView.prototype */
    {
            /**
             * @augments DiagramElementView.View
             * @constructs
             * @class ConnectionPointView Represents the view for connection points in a diagram.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
               DiagramElementView.prototype.initialize.call(this, options);
                this.model.on("connectionMade", this.onConnectionMade, this);
            },

            render: function(paperID){
                DiagramElementView.prototype.render.call(this, paperID);
            },

            onConnectionMade: function(connection){
                connection.point(this.getNextAvailableConnectionPoint());
            },

            getNextAvailableConnectionPoint: function(){
                return new GeoCore.Models.Point({x:0, y:0});
            }
    });

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
            DiagramElementView.prototype.initialize.call(this, options);
        },
        // disable horizontal drag for links
        horizontalDrag: function(){
            return true;
        },

        sourceMoved: function(event){
            this.d3el.attr('x1', this.model.source().point().x());
            this.d3el.attr('y1', this.model.source().point().y());
        },

        destinationMoved: function(event){
            this.d3el.attr('x2', this.model.destination().point().x());
            this.d3el.attr('y2', this.model.destination().point().y());
        },

        render: function (paperID) {

            DiagramElementView.prototype.render.call(this, paperID);

            var line = this.getD3Ref().draw.lineFromPoints(this.model.source().point(), this.model.destination().point())
                .classed(this.options.class, true);

            this.model.source().on("connectingPointChanged", this.sourceMoved, this);
            this.model.destination().on("connectingPointChanged", this.destinationMoved, this);

            this.d3el = line;
            this.el = line.node();
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
            var opts = options.options || {};
            opts.selector = opts.selector || ".editor";
            opts.diagram = opts.diagram || {};
            opts.diagram.height = opts.diagram.height || "100%" ;
            opts.diagram.width = opts.diagram.width || "100%" ;
            opts.diagram.class = opts.diagram.class || "diagram" ;
            opts.diagram.selector = opts.diagram.selector || ".diagram";
            this.options = opts;
        },

        render: function(){
            var container = d3.select(this.options.selector);
            if(_.isUndefined(container)){
                throw  this.options.selector + " is not a valid query selector for container";
            }
            // wrap d3 with custom drawing apis
            container = D3Utils.decorate(container);

            var svg = container.draw.svg(this.options.diagram);

            var defs = svg.append("defs");

            // add marker definitions
            defs.append("marker")
                .attr("id","markerArrow")
                .attr("markerWidth","13")
                .attr("markerHeight","13")
                .attr("refX","10")
                .attr("refY","6")
                .attr("orient","auto")
                .append("path")
                    .attr("d", "M2,2 L2,11 L10,6 L2,2")
                    .attr("class","marker");

            this.model.on("AddElement", this.onAddElement, this);

            this.d3el = svg;
            this.el = svg.node();
            return svg;
        },

        onAddElement:function(element, opts){
            var view = Diagrams.Utils.createViewForModel(element, opts);
            view.render(this.options.diagram.selector);
        },

        renderViewForElement: function(element, renderOpts){

        }

    });

    views.DiagramElementView = DiagramElementView;
    views.ShapeView = ShapeView;
    views.LinkView = LinkView;
    views.ConnectionView = ConnectionView;
    views.ConnectionPointView = ConnectionPointView;
    views.DiagramView = DiagramView;

    diagrams.Views = views;
    return diagrams;
}(Diagrams || {}));