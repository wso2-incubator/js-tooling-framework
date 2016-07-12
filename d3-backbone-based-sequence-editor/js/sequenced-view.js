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
         * Initialize center point for the view.
         *
         * @param options
         */
        initialize: function (options) {
            _.extend(this, _.pick(options, "centerPoint", "paperID"));
        },

        /**
         * Default drag move handler for views which will
         * drag the element along with the mouse pointer.
         *
         * @param dx
         * @param dy
         */
        dragMove: function (dx, dy) {
        },

        /**
         * Default drag start handler which captures original position
         * of the view.
         *
         */
        dragStart: function () {
        },

        /**
         * Default empty drag stop handler. Extending views need to override
         * for custom behaviour.
         */
        dragStop: function () {
        }
    });


    /**
     * LifeLine Backbone View
     */
    var LifeLineView = BaseView.extend({

        // fetch default class from prefs
        className: sequenced.prefs.lifeline.class,

        /**
         * Fetch and init LifeLine title.
         * @param options
         */
        initialize: function (options) {
            _.extend(this, _.pick(options, "title"));
            // call super
            BaseView.prototype.initialize(options);
        },


        render: function (paperID) {
            // set paper
            _.extend(this, {paperID:this.paperID || paperID || sequenced.paper.selector});

            // wrap d3 with custom drawing apis
            var d3Draw = d3_draw.wrap(d3.select(this.paperID));

            // fetch global prefs for LifeLines
            var prefs = sequenced.prefs.lifeline;

            var group = d3Draw.lifeLine(this.centerPoint, this.title, prefs);

            this.el = group;
            return group;
        }

    });

    views.BaseView = BaseView;
    views.LifeLineView = LifeLineView;

    return sequenced;

}(SequenceD || {}));
