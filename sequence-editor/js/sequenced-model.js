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

var SequenceD = (function (sequenced) {

    var models = sequenced.Models = {};

    // create the base model
    var BaseModel = Backbone.Model.extend(
    /** @lends BaseModel.prototype */
    {
        /**
         * @augments Backbone.Model
         * @constructs
         * @class BaseModel Represents the base model for components in Sequence Diagrams.
         */
        initialize: function() {},

        defaults:{
            paperID: SequenceD.prefs.paper.selector,
            created: new Date()
        },
        /**
         * Checks whether this model can be connected to a particular model.
         * @param {BaseModel} target Target model to connect to.
         */
        canConnectTo:function(target){
            return false;
        }
    });

    var Element = BaseModel.extend(
    /** @lends Element.prototype */
    {
        /**
         * @augments BaseModel
         * @constructs
         * @class Element represents the model for an elements in a diagram.
         */
        initialize: function() {},

        defaults:{
        }
    });

    var Link = BaseModel.extend(
    /** @lends Link.prototype */
    {
        /**
         * @augments BaseModel
         * @constructs
         * @class Link represents the model for a link between two elements in a diagrams.
         */
        initialize: function() {},

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

    var LifeLine = Element.extend(
    /** @lends LifeLine.prototype */
    {
        /**
         * @augments Element
         * @constructs
         * @class LifeLine Represents the model for a LifeLine in Sequence Diagrams.
         */
        initialize: function() {},

        defaults:{
            centerPoint: new graphics_core.Models.Point({x: 0, y: 0}),
            title: "lifeline"
        }
    });

    var Mediator = Element.extend(
    /** @lends Mediator.prototype */
    {
        /**
         * @augments Element
         * @constructs
         * @class Mediator Represents the model for a Mediator in an NEL Design Diagram.
         */
        initialize: function() {},

        defaults:{
            centerPoint: new graphics_core.Models.Point({x: 0, y: 0}),
            title: "Mediator"
        }
    });

    var Message = Link.extend(
    /** @lends Message.prototype */
    {
        /**
         * @augments Link
         * @constructs
         * @class Message Represents the model for a Message in Sequence Diagrams.
         */
        initialize: function() {},

        defaults:{
        },

        /**
         * Gets or sets source element for the Message.
         * @param {Mediator|LifeLine} [sourceElement] Source element
         */
        source: function(sourceElement){
            return Link.prototype.source(sourceElement);
        },
        /**
         * Gets or sets destination element for the Message.
         * @param {LifeLine} [lifeLine] Destination element
         */
        destination: function(lifeLine){
            return Link.prototype.source(lifeLine);
        }
    });

    // set models
    models.BaseModel = BaseModel;
    models.Element = Element;
    models.Link = Link;
    models.Message = Message;
    models.LifeLine = LifeLine;

    sequenced.Models = models;

    return sequenced;

}(SequenceD || {}));