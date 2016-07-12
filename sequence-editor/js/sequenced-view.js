/**
 * SequenceD-Views Module extension.
 *
 * Definition of Backbone Views required for Sequence Diagrams.
 */
var SequenceD = (function (sequenced) {

    var views = sequenced.Views = sequenced.Views || {};

    /**
     * Base View class to extend from.
     *
     * @type {*|void}
     */
    var BaseView = Backbone.View.extend({

        /**
         * Default drag move handler for views which will
         * drag the element along with the mouse pointer.
         *
         * @param dx
         * @param dy
         */
        dragMove: function (event) {
            var d = this.attribute("dragData");
            d.x += event.dx;
            d.y += event.dy;
            this.el.attr("transform", function(){
                return "translate(" + [ d.x,d.y ] + ")"
            })
        },

        /**
         * Default drag start handler which captures original position
         * of the view.
         *
         */
        dragStart: function (event) {
            if(this.attribute("dragData") === undefined){
                this.attribute("dragData", {x:event.dx, y:event.dy});
            }
        },

        /**
         * Default empty drag stop handler. Extending views need to override
         * for custom behaviour.
         */
        dragStop: function () {
            this.attribute("dragData", null);
        },

        attribute: function(name,value){
            if(value === undefined){
                return this.model.get(name);
            }
            if(name !== undefined){
                if(value !== null)
                {
                    var data = {};
                    data[name] = value;
                    this.model.set(data);
                }else{
                    this.model.unset(name);
                }
            }
        }
    });


    /**
     * LifeLine Backbone View
     */
    var LifeLineView = BaseView.extend({

        // fetch default class from prefs
        className: sequenced.prefs.lifeline.class,

        render: function (paperID) {
            // set paper
            this.attribute("paperID", this.paperID || paperID || sequenced.paper.selector);

            // wrap d3 with custom drawing apis
            var d3Draw = d3_draw.wrap(d3.select(this.attribute("paperID")));

            // fetch global prefs for LifeLines
            var prefs = sequenced.prefs.lifeline;

            var group = d3Draw.lifeLine(this.attribute('centerPoint'), this.attribute('title'), prefs);
            var viewObj = this;
            var drag = d3.drag()
                .on("start",function(){
                    viewObj.dragStart(d3.event);
                })
                .on("drag", function() {
                    viewObj.dragMove(d3.event);
                })
                .on("end",function(){
                    viewObj.dragStop();
                });

            group.call(drag);

            this.el = group;
            return group;
        }

    });

    views.BaseView = BaseView;
    views.LifeLineView = LifeLineView;

    return sequenced;

}(SequenceD || {}));
