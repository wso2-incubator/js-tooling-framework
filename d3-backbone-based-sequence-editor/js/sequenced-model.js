var SequenceD = (function (sequenced) {

    var models = sequenced.Models = {};

    // create the base model
    var Base = Backbone.Model.extend({



    });

    var LifeLine = Base.extend({


    });

    // set models
    models.Base = Base;
    models.LifeLine = LifeLine;


    sequenced.Models = models;

    return sequenced;

}(SequenceD || {}));