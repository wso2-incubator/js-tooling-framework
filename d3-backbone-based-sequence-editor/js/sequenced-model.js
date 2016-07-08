var SequenceD = (function (sequenced) {

    if (typeof GraphicsCore === 'undefined') {
        throw "2d-graphics-core.js Library is needed to continue.";
    }

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