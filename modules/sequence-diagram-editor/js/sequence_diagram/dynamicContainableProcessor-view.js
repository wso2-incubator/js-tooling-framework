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
 * SequenceD-Views Module extension.
 *
 * Definition of Backbone Views required for Sequence Diagrams.
 */
var SequenceD = (function (sequenced) {
    var views = sequenced.Views = sequenced.Views || {};

    var DynamicContainableProcessorView = Diagrams.Views.ShapeView.extend({
        /**
         * @augments ProcessorView
         * @constructs
         * @class UnitProcessorView Represents the view for UnitProcessor(Eg: logger, header etc.) components in Sequence Diagrams.
         * @param {Object} options Rendering options for the view
         */
        initialize: function (options, title) {
            Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            this.title = title;
        },

        verticalDrag: function () {
            return false;
        },

        render: function (paperID, center, parentModel, prefs) {
            console.log("Processor added");
            var rectBottomXXX = d3Ref.draw.rectWithTitle(center,
                60,
                prefs.rect.height,
                150,
                200,
                0,
                0,
                group,
                this.modelAttr('viewAttributes').colour,
                this.modelAttr('title')
            );
            console.log("started");
            var middleRect = d3Ref.draw.centeredBasicRect(createPoint(center.x(),
                center.y()+75), 150, 200 - prefs.rect.height, 0, 0, group);
            middleRect.on("mousedown", function () {
                var m = d3.mouse(this);
                this.mouseDown(prefs, center.x(), m[1]);
            }).on('mouseover', function () {
                console.log("middle rect detected");
                diagram.selectedNode = viewObj.model;
                d3.select(this).style("fill", "green").style("fill-opacity", 0.1);
            }).on('mouseout', function () {
                diagram.destinationLifeLine = diagram.selectedNode;
                diagram.selectedNode = null;
                d3.select(this).style("fill-opacity", 0.01);
            }).on('mouseup', function (data) {
            });
            console.log(middleRect);
            group.rect = rectBottomXXX;
            group.middleRect = middleRect;

            var centerPoint = center;
            var xValue = centerPoint.x();
            var yValue = centerPoint.y();
            //lifeLine.call(drag);
            yValue += 60;
            for (var id in this.modelAttr("children").models) {
                var processor = this.modelAttr("children").models[id];
                var processorView = new SequenceD.Views.Processor({model: processor, options: lifeLineOptions});
                var processorCenterPoint = createPoint(xValue, yValue);
                processorView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint, "processors");
                processor.setY(yValue);
                yValue += processor.getHeight()+ 30;
            }
        }

    });

    views.DynamicContainableProcessorView = DynamicContainableProcessorView;

    return sequenced;

}(SequenceD || {}));
