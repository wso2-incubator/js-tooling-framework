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

var graphics_core = (function (graphicsCore) {

    var models = graphicsCore.Models || {};


    var Point = Backbone.Model.extend(
    /** @lends Point.prototype */
    {
        /**
         * @augments Backbone.Model
         * @constructs
         * @class Point Represents a point in paper.
         */
        initialize: function() {},

        /**
         * Default point is {0,0}.
          */
        defaults: {
            x: 0,
            y: 0
        },
        /**
         * Returns Y coordinate of the Point.
         * @returns {number} X coordinate of the Point
         */
        getX: function () {
            return this.get('x');
        },
        /**
         * Returns Y coordinate of the Point.
         * @returns {number} Y coordinate of the Point
         */
        getY: function () {
            return this.get('y');
        },
        /**
         * Sets X coordinate of the Point.
         * @param {number} x X coordinate of the Point
         */
        setX: function (x) {
            this.set('x', x);
        },
        /**
         * Sets Y coordinate of the Point.
         * @param {number} y Y coordinate of the Point
         */
        setY: function (y) {
            this.set('y', y);
        },
        /**
         * Returns absolute distance in X axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Absolute distance in X axis.
         */
        absDistInXFrom: function (refPoint) {
            return Math.abs(this.getX() - refPoint.getX())
        },
        /**
         * Returns absolute distance in Y axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Absolute distance in Y axis.
         */
        absDistInYFrom: function (refPoint) {
            return Math.abs(this.getY() - refPoint.getY())
        },
        /**
         * Returns distance in X axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Distance in X axis.
         */
        distInXFrom: function (refPoint) {
            return this.getX() - refPoint.getX();
        },
        /**
         * Returns distance in Y axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Distance in Y axis.
         */
        distInYFrom: function (refPoint) {
            return this.getY() - refPoint.getY();
        }
    });

    var Line = Backbone.Model.extend(
    /** @lends Line.prototype */
    {
        /**
         * @augments Backbone.Model
         * @constructs
         * @class Line represents a line in paper.
         */
        initialize: function() {},

        /**
         * default line is a 0 length line at 0,0.
         */
        defaults: {
            start: new Point(),
            end: new Point()
        },

        /**
         * Get or set starting point of the line.
         * @param {Point} [point] Ignore if you only want to get the starting point.
         * @returns {Point|void} starting point of the line or void if setter is invoked.
         */
        start: function(point){
            if(point === undefined)
            {
                return this.get('start');
            }
            this.set('start', point);
        },
        /**
         * Get or set ending point of the line.
         * @param {Point} [point] Ignore if you only want to get the ending point.
         * @returns {Point|void} ending point of the line or void if setter is invoked.
         */
        end: function(point){
            if(point === undefined)
            {
                return this.get('start');
            }
            this.set('end',point);
        }
    });

    // set models
    models.Point = Point;
    models.Line = Line;


    graphicsCore.Models = models;

    return graphicsCore;

}(graphics_core || {}));