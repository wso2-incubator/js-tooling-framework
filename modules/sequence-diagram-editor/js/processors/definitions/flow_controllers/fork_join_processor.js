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

    var flowControllers = processors.flowControllers || {};

    //Define manipulator mediators
    var forkJoinProcessor = {
        id: "ForkJoinProcessor",
        title: "Fork Join",
        icon: "images/tool-icons/dgm-fork.svg",
        colour : "#ffffff",
        type : "MultiRegionHolderProcessor",
        containers: [
            {
                container:"ForkContainer",
                width: 600,
                height: 100,
                regions:[
                    {
                        name:"MainFlow",
                        parent: 'mainLifeline',
                        width: 200,
                        height: 100
                    },
                    {
                        name:"Workers",
                        parent: 'none',
                        width: 400,
                        height: 100,
                        getDefaultChildren: function (model) {
                            var defaultChildren = [];
                            var cp = createPoint(250, 50);
                            var lifeLineDef = MainElements.lifelines.WorkerLifeline;
                            var lifeline1 = createLifeLine("Fork1", cp, lifeLineDef.class, lifeLineDef.utils,
                                lifeLineDef.parameters, lifeLineDef.textModel, "Worker", lifeLineDef);
                            var lifeline2 = createLifeLine("Fork2", cp, lifeLineDef.class, lifeLineDef.utils,
                                lifeLineDef.parameters, lifeLineDef.textModel, "Worker", lifeLineDef);
                            defaultChildren.push(lifeline1);
                            defaultChildren.push(lifeline2);
                            return defaultChildren;
                        }
                    }
                ]
            }
            //{
            //    container:"JoinContainer",
            //    width: 600,
            //    height: 300,
            //    regions:[
            //        {
            //            name:"MainFlow",
            //            width: 200,
            //            height: 300
            //        },
            //        {
            //            name:"Workers",
            //            width: 400,
            //            height: 300
            //        }
            //    ]
            //}
        ],
        dragCursorOffset : { left: 30, top: -5 },
        createCloneCallback : function(view){
            function cloneCallBack() {
                var div = view.createContainerForDraggable();
                d3.xml("images/tool-icons/dgm-fork.svg").mimeType("image/svg+xml").get(function(error, xml) {
                    if (error) throw error;
                    var svg = xml.getElementsByTagName("svg")[0];
                    d3.select(svg).attr("width", "48px").attr("height", "108px");
                    div.node().appendChild(svg);
                });
                return div.node();
            }
            return cloneCallBack;
        },
        parameters: [
            {
                key: "condition",
                value: ""
            },
            {
                key: "description",
                value: "Description"
            }
        ],
        propertyPaneSchema: [
            {
                key: "condition",
                text: "Condition"
            },
            {
                key: "description",
                text: "Description"
            }
        ],
        utils: {
            getMyPropertyPaneSchema : function () {
                return Processors.flowControllers.IfElseMediator.propertyPaneSchema;
            },
            getMyParameters: function (model) {
                return model.attributes.parameters;
            },
            saveMyProperties: function (model, inputs) {
                model.attributes.parameters = [
                    {
                        key: "condition",
                        value: inputs.condition.value
                    },
                    {
                        key: "description",
                        value: inputs.description.value
                    }
                ];
            },
            getMySubTree: function (model) {

            },
            canConnectTo: function () {
                return ['Worker'];
            }
        }
    };

    // Add defined mediators to manipulators
    // Mediator id should be exactly match to name defining here.(Eg : "LogMediator")
    flowControllers.ForkJoinProcessor = forkJoinProcessor;

    processors.flowControllers = flowControllers;

    return processors;

}(Processors || {}));
