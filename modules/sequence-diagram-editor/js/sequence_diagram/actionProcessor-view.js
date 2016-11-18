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

    var ActionProcessorView = SequenceD.Views.Processor.extend(
        /** @lends ActionProcessorView.prototype */
        {
            /**
             * @augments ActionProcessorView
             * @constructs
             * @class ActionProcessorView Represents Actions such as "Start, etc"
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                SequenceD.Views.Processor.prototype.initialize.call(this, options);
            },

            render: function (paperID, center, parentModel, prefs) {
                var viewObj = this;
                var height = this.model.getHeight();
                var width = this.model.getWidth();
                var d3Ref = this.getD3Ref(paperID);
                var group = d3Ref.draw.group();
                var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");
                var title = this.model.get('title');

                var processorTitleRect = d3Ref.draw.rect((center.x() - width/2),
                    (center.y()),
                    width,
                    height,
                    0,
                    0,
                    group,
                    this.modelAttr('viewAttributes').colour);

                // We need connection staring point only for the processors which have outbound connections.
                if(!_.isUndefined(this.model.model.hasOutputConnection) && this.model.model.hasOutputConnection) {
                    var circle = d3Ref.draw.circle(center.x() + width/2, center.y() + height/2, height / 3, group, "#2c3e50");

                    circle.on("mousedown", function () {
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        var m = d3.mouse(this);
                        prefs.diagram.clickedLifeLine = parentModel;
                        prefs.diagram.trigger("messageDrawStart", parentModel,
                            new GeoCore.Models.Point({'x': center.x() + width/2, 'y': m[1]}));
                    }).on('mouseover', function () {
                        //setting current tab view based diagram model
                        diagram = defaultView.model;
                        diagram.selectedNode = parentModel;
                        d3.select(this).style("fill", "red").style("fill-opacity", 0.6)
                            .style("cursor", 'url(images/BlackHandwriting.cur), pointer');
                        // Update event manager with current active element type for validation
                        eventManager.isActivated(diagram.selectedNode.attributes.title);
                    }).on('mouseout', function () {
                        //diagram.destinationLifeLine = diagram.selectedNode;
                        diagram.selectedNode = null;
                        d3.select(this).style("fill-opacity", 0.01);
                        // Update event manager with out of focus on active element
                        eventManager.isActivated("none");
                    }).on('mouseup', function (data) {

                    });
                }

                var mediatorText = d3Ref.draw.textElement(center.x(),
                    center.y() + height/2,
                    title,
                    group)
                    .attr('text-anchor','middle')
                    .classed("genericT",true);

                //We will add edit and delete buttons if we have set editable and deletable to true in the processor definition.
                 if(!_.isUndefined(this.model.model.editable) && !_.isUndefined(this.model.model.deletable)
                     && this.model.model.editable && this.model.model.deletable) {
                     viewObj.addEditableAndDeletable(d3Ref, optionsMenuGroup, processorTitleRect, center, height, width, viewObj);
                 }

                group.rect = processorTitleRect;
                group.title = mediatorText;
                group.circle = circle;

                var inputMessagePoint = this.model.inputConnector();
                if(!_.isUndefined(inputMessagePoint)){
                    inputMessagePoint.x(center.x() - width/2);
                    inputMessagePoint.y(center.y() + height/2);
                }

                var outputMessagePoint = this.model.outputConnector();
                if(!_.isUndefined(outputMessagePoint)){
                    outputMessagePoint.x(center.x() + width/2);
                    outputMessagePoint.y(center.y() + height/2);
                }
            },

        });

    views.ActionProcessorView = ActionProcessorView;

    return sequenced;

}(SequenceD || {}));
