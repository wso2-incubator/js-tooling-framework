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

var Processors = (function (processors) {

    var manipulators = processors.manipulators || {};

    //Reply processor definition
    var replyProcessor = {
        id: "replyProcessor",
        title: "Reply",
        icon: "images/tool-icons/log.svg",
        colour : "#ffffff",
        type : "Action",
        editable : true,
        deletable: true,
        dragCursorOffset : { left: 24, top: -5 },
        createCloneCallback : function(view){
            function cloneCallBack() {
                var div = view.createContainerForDraggable();
                d3.xml("images/tool-icons/log_drag.svg").mimeType("image/svg+xml").get(function(error, xml) {
                    if (error) throw error;
                    var svg = xml.getElementsByTagName("svg")[0];
                    d3.select(svg).attr("width", "48px").attr("height", "108px");
                    div.node().appendChild(svg);
                });
                return div.node();
            }
            return cloneCallBack;
        },
        init : function(model, processor){
            var destination = model.diagramSourceElements().models[0];
            this.addInitArrow_(processor,destination);
        },

        addInitArrow_:function(source,destination){
            centerR = createPoint(200, 50);
            centerS = createPoint(380, 50);
            var sourcePoint = new SequenceD.Models.MessagePoint({
                model: {type: "messagePoint"},
                x: centerS.x(),
                y: centerS.y(),
                direction: "outbound"
            });
            var destinationPoint = new SequenceD.Models.MessagePoint({
                model: {type: "messagePoint"},
                x: centerR.x(),
                y: centerR.y(),
                direction: "inbound"
            });
            var messageLink = new SequenceD.Models.MessageLink({
                source: sourcePoint,
                destination: destinationPoint,
                priority: sourcePoint
            });
            var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
            var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
            destination.addChild(destinationPoint, messageOptionsInbound);
            source.inputConnector(sourcePoint);
        },

        propertyPaneSchema: [
            {
                key: "messageRef",
                text: "Reply Message"
            }
        ],
        parameters: [
            {
                key: "messageRef",
                value: "response"
            }
        ],
        utils : {
            getMyPropertyPaneSchema : function () {
                return Processors.manipulators.replyProcessor.propertyPaneSchema;
            },
            getMyParameters: function (model) {
                return model.attributes.parameters;
            },
            saveMyProperties: function (model, inputs) {

                model.attributes.parameters = [
                    {
                        key: "messageRef",
                        value: inputs.messageRef.value
                    }
                ];
            },
            getMySubTree: function (model) {
                var parameters = model.attributes.parameters;
                var log_configStart = "log(level=\"" + parameters[1].value + "\"," + "status=\"" + parameters[0].value + "\"";
                return new TreeNode("LogMediator", "LogMediator", log_configStart, ");");
            },
            createMyModel: function (model, view) {
                var position = createPoint(0, 0);
                var processor = model.createProcessor(
                    Processors.manipulators.replyProcessor.title,
                    position,
                    Processors.manipulators.replyProcessor.id,

                    {
                        type: Processors.manipulators.replyProcessor.type || "UnitProcessor",
                        initMethod: Processors.manipulators.replyProcessor.init,
                        editable: Processors.manipulators.replyProcessor.editable,
                        deletable: Processors.manipulators.replyProcessor.deletable,
                        hasOutputConnection : Processors.manipulators.replyProcessor.hasOutputConnection,
                        messageLinkType : Processors.manipulators.replyProcessor.messageLinkType
                    },
                    {colour: Processors.manipulators.replyProcessor.colour},
                    Processors.manipulators.replyProcessor.parameters,
                    Processors.manipulators.replyProcessor.utils
                );
                Processors.manipulators.replyProcessor.init(view.model, processor);
                model.addChild(processor);
                return processor;
            },
            outputs: false,
            getInputParams: function (model) {
                var inputParams = [];
                inputParams[0] = model.attributes.parameters[0];

                return inputParams;
            }
        }
    };

    // Add defined processors to manipulators
    // Mediator id should be exactly match to name defining here.(Eg : "LogMediator")
    manipulators.replyProcessor = replyProcessor;

    processors.manipulators = manipulators;

    return processors;

}(Processors || {}));
