/**
 * SequenceD-Views Module extension.
 *
 * Definition of Backbone Views required for Sequence Diagrams.
 */
var SequenceD = (function (sequenced) {

    var views = sequenced.Views = sequenced.Views || {},
        paper = sequenced.paper = Snap(sequenced.prefs.paper.selector);

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
            this.attr({
                transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
            });
        },

        /**
         * Default drag start handler which captures original position
         * of the view.
         *
         */
        dragStart: function () {
            this.data('origTransform', this.transform().local);
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
    var LifeLine = BaseView.extend({

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
            // fetch prefs for LifeLines
            var prefs = sequenced.prefs.lifeline;

            // get center point
            var cx = this.centerPoint.getX();
            var cy = this.centerPoint.getY();

            // create rect
            var r = paper.rect( cx - prefs.rect.width / 2,
                                cy - prefs.rect.height / 2,
                                prefs.rect.width,
                                prefs.rect.height,
                                prefs.rect.roundX,
                                prefs.rect.roundY)
                            .addClass(prefs.rect.class);

            // create title
            var t = paper.text(cx, cy, this.title)
                .insertAfter(r)
                .addClass(prefs.text.class);

            // create vertical line
            var l = paper.line( cx, cy + prefs.rect.height / 2,
                                cx, cy + prefs.rect.height / 2 + prefs.line.height)
                            .insertBefore(r)
                            .addClass(prefs.line.class);

            // group all elements
            var g = paper.group(r, t, l)
                .addClass(prefs.class);

            // set drag handlers
            g.drag(this.dragMove, this.dragStart, this.dragStop);

            // enable transform upon double click
            g.dblclick(new function(){
                g.ftCreateHandles();
            });

            // update dom element reference
            this.el = g;

            // support chaining
            return g;
        }

    });

    views.BaseView = BaseView;
    views.LifeLine = LifeLine;

    return sequenced;

}(SequenceD || {}));
