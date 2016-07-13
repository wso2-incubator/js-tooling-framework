/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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