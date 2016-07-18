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

var paper = "#mainPaper",
    toolPaneSelector = "#toolPane";

// options for lifeline view
var lifeLineOptions = {};
lifeLineOptions.class = "lifeline";
// rectangle options
lifeLineOptions.rect = {};
lifeLineOptions.rect.width = 200;
lifeLineOptions.rect.height = 75;
lifeLineOptions.rect.roundX = 20;
lifeLineOptions.rect.roundY = 20;
lifeLineOptions.rect.class = "lifeline-rect";
// line options
lifeLineOptions.line =  {};
lifeLineOptions.line.height = 800;
lifeLineOptions.line.class = "lifeline-line";
// text options
lifeLineOptions.text = {};
lifeLineOptions.text.class = "lifeline-title";

var createPoint = function(x, y){
    return new graphics_core.Models.Point({'x': x, 'y': y});
};


var addToolPanel = function(){
    var clonedOpts = _.cloneDeep(lifeLineOptions);
    clonedOpts.class = "lifeline";
    clonedOpts.rect.width = 80;
    clonedOpts.rect.height = 30;
    clonedOpts.rect.roundX = 2;
    clonedOpts.rect.roundY = 2;
    clonedOpts.rect.class = "lifeline-rect";
    clonedOpts.line.height = 60;
    clonedOpts.line.class = "lifeline-line";
    clonedOpts.text.class = "lifeline-title";

    var lLModel = new SequenceD.Models.LifeLine({title:"lifeline", paperID:toolPaneSelector, centerPoint: createPoint(250, 50)});
    var lLine = new SequenceD.Views.LifeLineView({model:lLModel, options:clonedOpts});
    lLine.render();

    //var dragStart = function(event)
};

var lifeLine1Model = new SequenceD.Models.LifeLine({title:"LifeLine1", paperID:paper, centerPoint: createPoint(250, 50)});
var lifeLine1 = new SequenceD.Views.LifeLineView({model:lifeLine1Model, options:lifeLineOptions});
lifeLine1.render();

var lifeLine2Model = new SequenceD.Models.LifeLine({title:"LifeLine2", paperID:paper, centerPoint: createPoint(500, 50)});
var lifeLine2 = new SequenceD.Views.LifeLineView({model:lifeLine2Model, options:lifeLineOptions});
lifeLine2.render();

var messageModel = new SequenceD.Models.Message({source:createPoint(250, 150), destination: createPoint(500, 150)});
var message1 = new SequenceD.Views.MessageView({model:messageModel, options:{'class':'message'}});
message1.render(paper);

var messageModel2 = new SequenceD.Models.Message({source:createPoint(250, 250), destination:createPoint(500, 250)});
var message2 = new SequenceD.Views.MessageView({model:messageModel2, options:{'class':'message'}});
message2.render(paper);


