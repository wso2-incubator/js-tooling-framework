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

    var LifeLine = Diagrams.Models.Shape.extend(
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

    var Message = Diagrams.Models.Link.extend(
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
            return Diagrams.Models.Link.prototype.source.call(this, sourceElement);
        },
        /**
         * Gets or sets destination element for the Message.
         * @param {LifeLine} [lifeLine] Destination element
         */
        destination: function(lifeLine){
            return Diagrams.Models.Link.prototype.destination.call(this, lifeLine);
        }
    });

    // set models
    models.Message = Message;
    models.LifeLine = LifeLine;

    sequenced.Models = models;

    return sequenced;

}(SequenceD || {}));