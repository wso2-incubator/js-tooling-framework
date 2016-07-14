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
         * Gets or sets X coordinate of the Point.
         * @returns {number|void} X coordinate of the Point or void.
         */
        x: function (newX) {
            if(newX === undefined){
                return this.get('x');
            }
            this.set('x', newX);
        },
        /**
         * Gets or sets Y coordinate of the Point.
         * @returns {number|void} Y coordinate of the Point or void.
         */
        y: function (newY) {
            if(newY === undefined){
                return this.get('y');
            }
            this.set('y', newY);
        },
        /**
         * Returns absolute distance in X axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Absolute distance in X axis.
         */
        absDistInXFrom: function (refPoint) {
            return Math.abs(this.distInXFrom(refPoint))
        },
        /**
         * Returns absolute distance in Y axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Absolute distance in Y axis.
         */
        absDistInYFrom: function (refPoint) {
            return Math.abs(this.distInYFrom(refPoint))
        },
        /**
         * Returns distance in X axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Distance in X axis.
         */
        distInXFrom: function (refPoint) {
            return this.x() - refPoint.x();
        },
        /**
         * Returns distance in Y axis from a given Point to this point.
         * @param {Point} refPoint Referring point.
         * @returns {number} Distance in Y axis.
         */
        distInYFrom: function (refPoint) {
            return this.y() - refPoint.y();
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
        },

        /**
         *  Gives the length of the line.
         *  @returns {number} length of the line.
         */
        length: function(){
            var absDistX = this.end().absDistInXFrom(this.start());
            var absDistY = this.end().absDistInYFrom(this.start());
            return Math.sqrt(Math.pow(absDistX, 2) + Math.pow(absDistY, 2));
        }
    });

    // set models
    models.Point = Point;
    models.Line = Line;


    graphicsCore.Models = models;

    return graphicsCore;

}(graphics_core || {}));