var SequenceD = (function (sequenced) {

    var models = sequenced.Models = {};

    // create the base model
    var Base = Backbone.Model.extend({
        defaults:{
            centerPoint: new graphics_core.Models.Point({x: 0, y: 0}),
            created: new Date()
        }
    });

    var LifeLine = Base.extend({
        defaults:{
            title: "lifeline",
            paperID: SequenceD.prefs.paper.selector
        }
    });

    // set models
    models.Base = Base;
    models.LifeLine = LifeLine;


    sequenced.Models = models;

    return sequenced;

}(SequenceD || {}));