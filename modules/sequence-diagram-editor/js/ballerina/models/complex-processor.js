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
define(['diagram_core', './processor'], function (DiagramCore, Processor) {

    var ComplexProcessor = Processor.extend(
    /** @lends ComplexProcessor.prototype */
    {
        selectedNode: null,
        /**
         * @augments ComplexProcessor
         * @constructs
         * @class ComplexProcessor represents the model for ComplexProcessor.
         */
        initialize: function (attrs, options) {
            Processor.prototype.initialize.call(this, attrs, options);
            var ContainableProcessorElements = require('app/ballerina/models/containable-processor-elements');
            var containableProcessorElements = new ContainableProcessorElements([], {diagram: this});
            this.containableProcessorElements(containableProcessorElements);
        },

        modelName: "ComplexProcessor",

        idAttribute: this.cid,

        defaults: {
            centerPoint: new DiagramCore.Models.Point({x: 0, y: 0}),
            title: "ComplexProcessor"
        },

        containableProcessorElements: function (containableProcessorElements) {
            if (_.isUndefined(containableProcessorElements)) {
                return this.get('containableProcessorElements');
            } else {
                this.set('containableProcessorElements', containableProcessorElements);
            }
        },

        setY: function (y) {
            this.get('centerPoint').set('y', y);
        },

        setX: function (x) {
            this.get('centerPoint').set('x', x);
        },

        getX: function () {
            this.get('centerPoint').get('x');
        },

        getWidth: function () {
            return this.get('width');
        },

        setWidth: function (width) {
            this.set('width', width);
        }

    });

    return ComplexProcessor;
});

