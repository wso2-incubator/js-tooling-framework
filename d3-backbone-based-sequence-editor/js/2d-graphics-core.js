var graphics_core = (function (graphicsCore) {

    var models = graphicsCore.Models || {};

    // create the model for a Point
    var Point = Backbone.Model.extend({
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
    models.Point = Point;

    graphicsCore.Models = models;

    return graphicsCore;

}(graphics_core || {}));