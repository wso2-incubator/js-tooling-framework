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
    lifeLineOptions = {};

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
    return new GeoCore.Models.Point({'x': x, 'y': y});
};

var createLifeLine = function(title, center, options){
    var model = new SequenceD.Models.LifeLine({title:title, centerPoint: center});
    var view = Diagrams.Utils.createViewForModel(SequenceD.Views, model, options.lifeLineOptions);
    view.render(options.paper);
};

var createMessage = function(start, end, options){
    var model = new SequenceD.Models.Message({source: start, destination: end});
    var view = new SequenceD.Views.MessageView({model: model, options: options.messageOptions});
    view.render(options.paper);
};

var lifeViewOpts = {paper:paper, lifeLineOptions:lifeLineOptions};
createLifeLine("LifeLine1",createPoint(250, 50), lifeViewOpts);
createLifeLine("LifeLine2",createPoint(500, 50), lifeViewOpts);
createLifeLine("LifeLine3",createPoint(750, 50), lifeViewOpts);
createLifeLine("LifeLine4",createPoint(1000, 50), lifeViewOpts);

var messageViewOpts  = {paper:paper, messageOptions:{'class':'message'}};
createMessage(createPoint(250, 150), createPoint(500,150), messageViewOpts);
createMessage(createPoint(500, 175), createPoint(250,175), messageViewOpts);
createMessage(createPoint(500, 200), createPoint(750,200), messageViewOpts);
createMessage(createPoint(750, 225), createPoint(1000,225), messageViewOpts);
createMessage(createPoint(1000, 250), createPoint(750,250), messageViewOpts);
createMessage(createPoint(250, 300), createPoint(1000,300), messageViewOpts);



