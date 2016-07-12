/**
 * SequenceD-Prefs Module extension.
 *
 * Initialize preferences.
 */
var SequenceD = (function (sequenced) {
    var prefs = sequenced.prefs || {},
        lifeLinePrefs = prefs.lifeline || {},
        paperPrefs = prefs.paper || {};

    // set css selector for paper - default mainPaper
    paperPrefs.selector = "#mainPaper";

    // prefs for lifeline view
    lifeLinePrefs.class = "lifeline";
    // rectangle prefs
    lifeLinePrefs.rect = lifeLinePrefs.rect || {};
    lifeLinePrefs.rect.width = 200;
    lifeLinePrefs.rect.height = 75;
    lifeLinePrefs.rect.roundX = 20;
    lifeLinePrefs.rect.roundY = 20;
    lifeLinePrefs.rect.class = "lifeline-rect";
    // line prefs
    lifeLinePrefs.line = lifeLinePrefs.line || {};
    lifeLinePrefs.line.height = 800;
    lifeLinePrefs.line.class = "lifeline-line";
    // text prefs
    lifeLinePrefs.text = lifeLinePrefs.text || {};
    lifeLinePrefs.text.class = "lifeline-title";

    // set pref categories
    prefs.lifeline = lifeLinePrefs;
    prefs.paper = paperPrefs;

    // set global prefs
    sequenced.prefs = prefs;

    return sequenced;

}(SequenceD || {}));