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
            initialize: function (attrs, options) {
                Diagrams.Models.Shape.prototype.initialize.call(this, attrs, options);
            },

            modelName: "LifeLine",

            nameSpace: sequenced,

            defaults: {
                centerPoint: new GeoCore.Models.Point({ x: 0, y: 0 }),
                title: "lifeline"
            },

            createActivation: function (opts) {
                var activation = new SequenceD.Models.Activation({ owner: this }, opts);
                this.addConnectionPoint(activation);
                return activation;
            }
        });

    var Activation = Diagrams.Models.ConnectionPoint.extend(
        /** @lends Activation.prototype */
        {
            /**
             * @augments ConnectionPoint
             * @constructs
             * @class Activation Represents the model for an activation in Sequence Diagrams.
             */
            initialize: function (attrs, options) {
                Diagrams.Models.ConnectionPoint.prototype.initialize.call(this, attrs, options);
                this.owner().addConnectionPoint(this);
            },

            modelName: "Activation",

            nameSpace: sequenced

        });

    var Message = Diagrams.Models.Link.extend(
        /** @lends Message.prototype */
        {
            /**
             * @augments Link
             * @constructs
             * @class Message Represents the model for a Message in Sequence Diagrams.
             */
            initialize: function (attrs, options) {
                Diagrams.Models.Link.prototype.initialize.call(this, attrs, options);
            },

            modelName: "Message",

            nameSpace: sequenced,

            defaults: {
            },

            source: function (ConnectionPoint) {
                return Diagrams.Models.Link.prototype.source.call(this, ConnectionPoint);
            },

            destination: function (ConnectionPoint) {
                return Diagrams.Models.Link.prototype.destination.call(this, ConnectionPoint);
            },

            makeParallel: function () {
                return false;
            }
        });

    // set models
    models.Activation = Activation;
    models.Message = Message;
    models.LifeLine = LifeLine;

    sequenced.Models = models;

    return sequenced;

} (SequenceD || {}));