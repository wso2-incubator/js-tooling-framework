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
define(['lodash', 'd3','log', './ballerina-statement-view', './../ast/get-action-statement','./point', 'd3utils','./action-processor-view'],
    function (_, d3, log, BallerinaStatementView, GetActionStatement,Point, D3Utils,ActionProcessor) {

        var GetActionStatementView = function (args) {
            BallerinaStatementView.call(this, args);
            this._connectorView = {};

            if (_.isNil(this._model) || !(this._model instanceof GetActionStatement)) {
                log.error("Action statement definition is undefined or is of different type." + this._model);
                throw "Action statement definition is undefined or is of different type." + this._model;
            }

            if (_.isNil(this._container)) {
                log.error("Container for action statement is undefined." + this._container);
                throw "Container for action statement is undefined." + this._container;
            }
            this.init();


        };

        GetActionStatementView.prototype = Object.create(BallerinaStatementView.prototype);
        GetActionStatementView.prototype.constructor = GetActionStatementView;

        GetActionStatementView.prototype.init = function(){
            this.getModel().on("drawConnectionForAction",this.drawActionConnections,this);
        };
        GetActionStatementView.prototype.setDiagramRenderingContext = function(context){
            this._diagramRenderingContext = context;
        };
        GetActionStatementView.prototype.getDiagramRenderingContext = function(){
            return this._diagramRenderingContext;
        };

        GetActionStatementView.prototype.drawActionConnections = function(startPoint,parent){
            log.info("Drawing connections for http connector actions");

            if(!_.isNil(this.getModel().getConnector())) {
                var connectorViewOpts = this.getDiagramRenderingContext().getViewModelMap()[this.getModel().getConnector().id].getViewOptions();
                var connectorCenterPointX = connectorViewOpts.connectorCenterPointX;
                var connectorCenterPointY = connectorViewOpts.connectorCenterPointY;
                var startX = Math.round(startPoint.x());
               // var arrowX = Math.round(endPoint.x()) - 5;
               // var arrowY = Math.round(endPoint.y());
                var processorConnector = D3Utils.line(Math.round(startPoint.x()), Math.round(startPoint.y()), Math.round(connectorCenterPointX),
                    Math.round(startPoint.y()), parent).classed("action-line", true);
                var arrowHead = D3Utils.inputTriangle(Math.round(connectorCenterPointX) - 5, Math.round(startPoint.y()), parent).classed("action-arrow", true);
                var processorConnector2 = D3Utils.line(Math.round(startPoint.x()), Math.round(startPoint.y()) + 8, Math.round(connectorCenterPointX),
                    Math.round(startPoint.y()) + 8, parent).classed("action-dash-line", true);
                D3Utils.outputTriangle(Math.round(startPoint.x()), Math.round(startPoint.y()) + 8, parent).classed("action-arrow", true);
            }

        };

        GetActionStatementView.prototype.setModel = function (model) {
            if (!_.isNil(model) && model instanceof GetActionStatement) {
                this._model = model;
            } else {
                log.error("Action statement definition is undefined or is of different type." + model);
                throw "Action statement definition is undefined or is of different type." + model;
            }
        };

        GetActionStatementView.prototype.setContainer = function (container) {
            if (!_.isNil(container)) {
                this._container = container;
            } else {
                log.error("Container for action statement is undefined." + container);
                throw "Container for action statement is undefined." + container;
            }
        };

        GetActionStatementView.prototype.setViewOptions = function (viewOptions) {
            this._viewOptions = viewOptions;
        };

        GetActionStatementView.prototype.getModel = function () {
            return this._model;
        };

        GetActionStatementView.prototype.getContainer = function () {
            return this._container;
        };

        GetActionStatementView.prototype.getViewOptions = function () {
            return this._viewOptions;
        };

        GetActionStatementView.prototype.setConnectorView = function(view){
            this._connectorView = view;
        };
        GetActionStatementView.prototype.getConnectorView = function(){
            return this._connectorView;
        }

        /**
         * Rendering the view for get-Action statement.
         * @returns {group} The svg group which contains the elements of the action statement view.
         */
        GetActionStatementView.prototype.render = function (renderingContext) {
            this.setDiagramRenderingContext(renderingContext);
          var parentGroup = $(this._container)[0].getElementById("contentGroup");
            var actionStatementGroup = D3Utils.group(d3.select(parentGroup));
            actionStatementGroup.attr("id","actionStatementGroup_" +this._model.id);
            log.info("Rendering the Get Action Statement.");
            //TODO: make constants
            var processorViewOpts = {};
            var processorWidth = 120;
            var processorHeight = 30;

           var processorCenterPointX = this.getXPosition() + 60;
           var processorCenterPointY = this.getYPosition();
            var processorWidth = 120;
            var processorHeight = 30;
            var sourcePointX = processorCenterPointX + 60;
             var sourcePointY = processorCenterPointY;

            //if(!_.isNil(this.getConnectorView())) {
            //    var sourcePointX = processorCenterPointX + 60;
            //    var sourcePointY = processorCenterPointY;
            //    var destinationPointX = this.getConnectorView().getViewOptions().connectorCenterPointX;
            //    var arrowX = destinationPointX - 5;
            //    var arrowY = processorCenterPointY;
            //}
            if(!this.getModel().isUserDropped){
                // processorViewOpts = {
                //    parent: actionStatementGroup,
                //    root: parentGroup,
                //    processorWidth: processorWidth,
                //    processorHeight: processorHeight,
                //    centerPoint: {
                //        x: processorCenterPointX,
                //        y: processorCenterPointY
                //    },
                //    sourcePoint: {
                //        x: sourcePointX,
                //        y: sourcePointY
                //    },
                //    destinationPoint: {
                //        x: destinationPointX,
                //        y: sourcePointY
                //    },
                //    action: "Invoke",
                //    inArrow: true,
                //    outArrow: true,
                //    arrowX: arrowX,
                //    arrowY: arrowY
                //
                //};
            }
            else{
                processorViewOpts = {
                    parent: actionStatementGroup,
                    root: parentGroup,
                    processorWidth: processorWidth,
                    processorHeight: processorHeight,
                    centerPoint: {
                        x: processorCenterPointX,
                        y: processorCenterPointY
                    },
                    action: "Invoke"


                };
            }

            this.setBoundingBox(processorWidth, processorHeight, processorCenterPointX, processorCenterPointY);


            var lineGap = 8;
            var centerTextXGap = 40;
            var centerTextYGap = 20;
            var processorRect = D3Utils.centeredRect(new Point(processorCenterPointX,processorCenterPointY), processorWidth
                , processorHeight, 0, 0, actionStatementGroup).classed("action-rect", true);

            var processorConnectorPoint = D3Utils.circle(((processorCenterPointX - processorWidth /2) + processorWidth),((processorCenterPointY - processorHeight/2) + 15), 10,actionStatementGroup);
            processorConnectorPoint.attr("fill-opacity",0.01);

            var processorText = D3Utils.textElement((processorCenterPointX + centerTextXGap -  processorWidth / 2), (processorCenterPointY + centerTextYGap - (processorHeight / 2)),
                "Invoke", actionStatementGroup).classed("action-text", true);

            this.processorRect = processorRect;
            this.processorConnectPoint = processorConnectorPoint;
            this.sourcePoint = new Point(sourcePointX, sourcePointY);
            this.parentContainer = d3.select(parentGroup);
            var self = this;

            this.processorConnectPoint.on("mousedown",function(){
                d3.event.preventDefault();
                d3.event.stopPropagation();
                var m = d3.mouse(this);

                self.messageManager.startDrawMessage(self._model,self.sourcePoint,self.parentContainer);

            });

            this.processorConnectPoint.on("mouseover",function(){
                processorConnectorPoint.style("fill", "red").style("fill-opacity", 0.5)
                    .style("cursor", 'url(images/BlackHandwriting.cur), pointer');
            });

            this.processorConnectPoint.on("mouseout",function(){
                processorConnectorPoint.style("fill", "#2c3e50").style("fill-opacity",0.01);
            });





      //   var actionStatementView = new ActionProcessor(processorViewOpts);
        // actionStatementView.render();



        };


        return GetActionStatementView;
    });