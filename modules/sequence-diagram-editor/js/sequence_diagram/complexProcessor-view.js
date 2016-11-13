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

    var ComplexProcessorView = Diagrams.Views.ShapeView.extend(
        {
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

                var containableProcessorElementViewArray = [];


                var centerPoint = center;
                var xValue = centerPoint.x();
                var yValue = centerPoint.y();

                var totalHeight = 0;
                var maximumWidth = 150;

                var deltaDistance = 0;
                var destinationX = 0;

                for (var id in this.modelAttr("containableProcessorElements").models) {

                    var containableProcessorElement = this.modelAttr("containableProcessorElements").models[id];
                    var containableProcessorElementView = new SequenceD.Views.ContainableProcessorElement({
                        model: containableProcessorElement,
                        options: lifeLineOptions
                    });
                    var processorCenterPoint = createPoint(xValue, yValue);
                    var elemView = containableProcessorElementView.render("#" + defaultView.options.diagram.wrapperId, processorCenterPoint);
                    containableProcessorElement.setY(yValue);
                    containableProcessorElement.setX(xValue);
                    containableProcessorElementViewArray.push(elemView);
                    yValue = yValue + containableProcessorElement.getHeight();
                    totalHeight += containableProcessorElement.getHeight();
                    //yValue += 60;
                    //var processor = this.modelAttr("children").models[id];
                    //var processorView = new SequenceD.Views.Processor({model: processor, options:
                    // lifeLineOptions}); var processorCenterPoint = createPoint(xValue, yValue);
                    // processorView.render("#diagramWrapper", processorCenterPoint); processor.setY(yValue);

                    var childElementsInContainableProcessorElement = containableProcessorElement.get("children").models;
                    var sourceX = 0;
                    if (childElementsInContainableProcessorElement.length != 0) {
                        for (var child in childElementsInContainableProcessorElement) {
                            if (childElementsInContainableProcessorElement[child].get("outputConnector") != null) {
                                if (childElementsInContainableProcessorElement[child].get("outputConnector").get("message") != null) {
                                    if (childElementsInContainableProcessorElement[child].get("outputConnector").get("message").get("destination") != null) {
                                        var destinationXVal = childElementsInContainableProcessorElement[child].get("outputConnector").get("message").get("destination").get("centerPoint").get("x");
                                        sourceX = childElementsInContainableProcessorElement[child].get("outputConnector").get("message").get("source").get("centerPoint").get("x");
                                        if (destinationX < destinationXVal) {
                                            destinationX = destinationXVal;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (destinationX != 0 && sourceX != 0) {
                        deltaDistance = (destinationX - sourceX) + 30;
                    }

                    if (maximumWidth < containableProcessorElement.getWidth()) {
                        maximumWidth = containableProcessorElement.getWidth();
                    }
                }

                var newWidth = maximumWidth + deltaDistance;

                var arrayLength = containableProcessorElementViewArray.length;
                for (var i = 0; i < arrayLength; i++) {

                    var middleRect = containableProcessorElementViewArray[i].middleRect;
                    var rect = containableProcessorElementViewArray[i].rect;
                    var titleRect = containableProcessorElementViewArray[i].titleRect;
                    var text = containableProcessorElementViewArray[i].text;

                    var initWidth = middleRect.attr("width");
                    middleRect.attr("width", newWidth);
                    rect.attr("width", newWidth);

                    var deviation = (maximumWidth - initWidth) / 2;

                    middleRect.attr("x", parseInt(middleRect.attr("x")) - deviation);
                    rect.attr("x", parseInt(rect.attr("x")) - deviation);
                    titleRect.attr("x", parseInt(titleRect.attr("x")) - deviation);
                    text.attr("x", parseInt(text.attr("x")) - deviation);

                }

                this.model.setHeight(totalHeight);
                this.model.setWidth(maximumWidth);
            }
        });

    views.ComplexProcessorView = ComplexProcessorView;

    return sequenced;

}(SequenceD || {}));