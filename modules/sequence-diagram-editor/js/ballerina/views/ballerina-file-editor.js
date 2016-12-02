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
define(['lodash','log','./service-definition-view'], function(_,log,ServiceDefView){

    var ballerinaFileEditor = function(canvasList,astRoot){
      this.canvasList = canvasList || [];
        this._astRoot = astRoot;

    }

    ballerinaFileEditor.prototype.addCanvas = function(canvas){
        if(!_.isNil(canvas)){
            this.canvasList.add(canvas);
        }
        else{
            log.error("Unable to add empty canvas" + canvas);
        }


    };
    ballerinaFileEditor.prototype.init = function(astRoot,options){
          var errMsg;
        if (!_.has(options, 'container')) {
            errMsg = 'unable to find configuration for container';
            log.error(errMsg);
            throw errMsg;
        }
        var container = $(_.get(options, 'container'));
        // check whether container element exists in dom
        if (!container.length > 0) {
            errMsg = 'unable to find container for file editor with selector: ' + _.get(options, 'container');
            log.error(errMsg);
            throw errMsg;
        }
        if(!_.isNil(astRoot)){

            if(_.has(astRoot, 'serviceDefinitions')) {

                var serviceDefs = $(_.get(astRoot,'serviceDefinitions'));
                _.each(serviceDefs, function (serviceModel) {

                    //TODO: Add serviceModel id and css props
                    var serviceContainer = $('<div></div>');
                    var serviceView = new ServiceDefView(serviceModel,serviceContainer);
                    this.addCanvas(serviceView);
                });
            }
                if(_.has(astRoot, 'functionDefinitions')){
                    _.each(astRoot.functionDefinitions, function(functionModel){
                        var functionContainer = $('<div></div>');
                        var functionView = new FunctionDefinitionView(functionModel,functionContainer);
                        this.addCanvas(functionView);
                    });
            }
                if(_.has(astRoot, 'connectorDefinitions')){
                    _.each(astRoot.connectorDefinitions, function(connectorModel){
                        var connectorContainer = $('<div></div>');
                        var connectorView = new ConnectorDefinitionView(connectorModel,connectorContainer);
                        this.addCanvas(connectorView);
                    });
                }
                //TODO: rest of definitions when implemented
        }
        else{
           log.error("Provided astRoot is undefined"+ astRoot);
        }

        this.render(container);

    };

    ballerinaFileEditor.prototype.render = function(parent){
       if(!_.isNil(this.canvasList)){
           _.each(this.canvasList, function(canvas){
               //draw a collapse accordion
               var outerDiv = $('<div></div>');
               outerDiv.addClass('panel panel-default');
               var panelHeading = $('<div></div>');
               panelHeading.addClass('panel-heading');
               //TODO: UPDATE ID
               panelHeading.attr('id','headingTwo').attr('role','tab');
               var panelTitle = $('<h4></h4>');
               panelTitle.addClass('panel-title');
               var titleLink =  $('<a></a>');
               titleLink.addClass("collapsed");
               //TODO: update href,aria-controls
               titleLink.attr('data-toggle','collapse').attr('data-parent',"#accordion").attr('href','#collapseTwo').attr('aria-expanded','false').attr('aria-controls,"collapseTwo');
              panelTitle.append(titleLink);
               panelHeading.append(panelTitle);

               var bodyDiv = $('<div></div>');
               bodyDiv.addClass('panel-collapse collapse');
               //TODO: UPDATE ID
               bodyDiv.attr('id','collapseTwo').attr('aria-labelledby','headingTwo').attr('role','tabpanel');
               bodyDiv.append(canvas);

               outerDiv.append(panelHeading);
               outerDiv.append(bodyDiv);


               // append to parent
               parent.append(outerDiv);
           });
       }
    };

});
