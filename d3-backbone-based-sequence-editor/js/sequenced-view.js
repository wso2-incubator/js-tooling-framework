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
            _.extend(this, _.pick(options, "centerPoint"));
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

        /**
         * Render LifeLine
         *
         * @returns {Snap.Element} rendered SVG Element.
         */
        render: function () {
        }

    });

    views.BaseView = BaseView;
    views.LifeLine = LifeLineView;

    return sequenced;

}(SequenceD || {}));
