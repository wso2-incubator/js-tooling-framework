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