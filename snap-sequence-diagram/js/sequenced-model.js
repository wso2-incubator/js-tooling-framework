var SequenceD = (function (sequenced) {

    var models = sequenced.Models = {};

    // create the base model
    var Base = Backbone.Model.extend({



    });

    // create the model for a Point
    var Point = Base.extend({
        defaults: {
            x: 0,
            y: 0
        },
        getX: function () {
            return this.get('x');
        },
        getY: function () {
            return this.get('y');
        },
        setX: function (x) {
            return this.set('x', x);
        },
        setY: function (y) {
            return this.set('y', y);
        },
        absDistInXFrom: function (refPoint) {
            return Math.abs(this.getX() - refPoint.getX())
        },
        absDistInYFrom: function (refPoint) {
            return Math.abs(this.getY() - refPoint.getY())
        },
        distInXFrom: function(refPoint){
            return this.getX() - refPoint.getX();
        },
        distInYFrom: function(refPoint){
            return this.getY() - refPoint.getY();
        }
    });

    // set models
    models.Base = Base;
    models.Point = Point;
    sequenced.Models = models;

    return sequenced;

}(SequenceD || {}));