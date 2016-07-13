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

    var LifeLine = BaseModel.extend(
    /** @lends LifeLine.prototype */
    {
        /**
         * @augments BaseModel
         * @constructs
         * @class LifeLine Represents the model for a LifeLine in Sequence Diagrams.
         */
        initialize: function() {},

        defaults:{
            centerPoint: new graphics_core.Models.Point({x: 0, y: 0}),
            title: "lifeline"
        }
    });

    // set models
    models.BaseModel = BaseModel;
    models.LifeLine = LifeLine;

    sequenced.Models = models;

    return sequenced;

}(SequenceD || {}));