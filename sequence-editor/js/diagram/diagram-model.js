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

    var models = diagrams.models || {};

    var DiagramElement = Backbone.Model.extend(
    /** @lends DiagramElement.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Element represents the model for elements in a diagram.
         */
        initialize: function() {},

        modelName : "DiagramElement",

        defaults:{
        }
    });

    var Shape = DiagramElement.extend(
    /** @lends Link.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Link represents the model for a link between two elements in a diagrams.
         */
        initialize: function() {},

        modelName : "Shape",

        defaults:{
        },
        /**
         * Gets or sets source element for the link.
         * @param {Element} [element] Source element
         */
        source: function(element){
            if(element === undefined){
                return this.get('source');
            }
            this.set('source', element);
        },
        /**
         * Gets or sets destination element for the link.
         * @param {Element} [element] Destination element
         */
        destination: function(element){
            if(element === undefined){
                return this.get('destination');
            }
            this.set('destination', element);
        }
    });

    var Link = DiagramElement.extend(
    /** @lends Link.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Link represents the model for a link between two elements in a diagrams.
         */
        initialize: function() {},

        modelName : "Link",

        defaults:{
        },
        /**
         * Gets or sets source element for the link.
         * @param {Element} [element] Source element
         */
        source: function(element){
            if(element === undefined){
                return this.get('source');
            }
            this.set('source', element);
        },
        /**
         * Gets or sets destination element for the link.
         * @param {Element} [element] Destination element
         */
        destination: function(element){
            if(element === undefined){
                return this.get('destination');
            }
            this.set('destination', element);
        }
    });

    var DiagramElements = Backbone.Collection.extend(
    /** @lends DiagramElements.prototype */
    {
        /**
         * @augments Backbone.Collection
         * @constructs
         * @class DiagramElements represents the collection for elements in a diagram.
         */
        initialize: function() {},

        modelName : "DiagramElements",

        model: DiagramElement
    });


    var Diagram = Backbone.Model.extend(
    /** @lends Diagram.prototype */
    {
        modelName : "Diagram",
        /**
         * @augments Backbone.Model
         * @constructs
         * @class Diagram represents the model for aa diagrams.
         */
        initialize: function(options) {

            var elements = new DiagramElements({
                diagram: this
            });

            this.set('diagramElements', elements);

        },

        addElement: function(element, opts){
            this.get('diagramElements').add(element, opts);
        },

        getElement: function(id){
            return this.get('diagramElements').get(id);
        }

    });

    models.DiagramElement = DiagramElement;
    models.DiagramElements = DiagramElements;
    models.Diagram = Diagram;
    models.Shape = Shape;
    models.Link = Link;
    diagrams.Models = models;
    return diagrams;
}(Diagrams || {}));


