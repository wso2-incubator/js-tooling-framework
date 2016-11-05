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



var eventManager = new Diagrams.Models.EventManager({});
var lifeLineOptions = {};
var resourceLifeLineOptions = {};
lifeLineOptions.class = "lifeline";
// Lifeline rectangle options
lifeLineOptions.rect = {};
lifeLineOptions.rect.width = 100;
lifeLineOptions.rect.height = 30;
lifeLineOptions.rect.roundX = 20;
lifeLineOptions.rect.roundY = 20;
lifeLineOptions.rect.class = "lifeline-rect";

// Setting the default service parameters
serviceProduces = "MediaType.APPLICATION_JSON"
serviceBasePath = "/stock";
servicePackageName = "com.sample";
serviceTags = "stock_info,stock_update";
serviceDescription = "Rest api for get stocks details";

// Lifeline middle-rect options
lifeLineOptions.middleRect = {};
lifeLineOptions.middleRect.width = 100;
lifeLineOptions.middleRect.height = 300;
lifeLineOptions.middleRect.roundX = 1;
lifeLineOptions.middleRect.roundY = 1;
lifeLineOptions.middleRect.class = "lifeline-middleRect";

// Lifeline options
lifeLineOptions.line = {};
lifeLineOptions.line.height = 300;
lifeLineOptions.line.class = "lifeline-line";
// Lifeline text options
lifeLineOptions.text = {};
lifeLineOptions.text.class = "lifeline-title";

var createPoint = function (x, y) {
    return new GeoCore.Models.Point({'x': x, 'y': y});
};

var diagramD3el = undefined;

var createLifeLine = function (title, center, cssClass, utils, parameters, initTextModel, type) {
    var lifeline =  new SequenceD.Models.LifeLine({
        title: title,
        centerPoint: center,
        cssClass: cssClass,
        utils: utils,
        parameters: parameters,
        textModel: initTextModel,
        type: type
    });

    //TODO : Adding text model
    var textModel = new Diagrams.Models.TextController({});
    lifeline.attributes.textModel = textModel;
    // TODO: For sample usage of events firing: adding lifeLine itself as parent
    textModel.hasParent = true;
    textModel.parentObject(lifeline);
    lifeline.leftUpperConer({x: center.attributes.x - 65, y: center.attributes.y - 15});
    lifeline.rightLowerConer({
        x: center.attributes.x + 65,
        y: center.attributes.y + 15 + lifeLineOptions.middleRect.height + lifeLineOptions.rect.height
    });

    return lifeline;

};
// Create main tool group
var mainToolGroup = new Tools.Models.ToolGroup({
    toolGroupName: "Main Elements",
    toolGroupID: "main-tool-group"
});

for (var lifeline in MainElements.lifelines) {
    var tool = new Tools.Models.Tool(MainElements.lifelines[lifeline]);
    mainToolGroup.toolCollection.add(tool);
}

// Create mediators tool group
var mediatorsToolGroup = new Tools.Models.ToolGroup({
    toolGroupName: "Mediators",
    toolGroupID: "mediators-tool-group"
});

for (var manipulator in Processors.manipulators) {
    var tool = new Tools.Models.Tool(Processors.manipulators[manipulator]);
    mediatorsToolGroup.toolCollection.add(tool);
}
for (var flowController in Processors.flowControllers) {
    var tool = new Tools.Models.Tool(Processors.flowControllers[flowController]);
    mediatorsToolGroup.toolCollection.add(tool);
}

// Create tool palette
var toolPalette = new Tools.Models.ToolPalatte();
toolPalette.add(mainToolGroup);
toolPalette.add(mediatorsToolGroup);

var paletteView = new Tools.Views.ToolPalatteView({collection: toolPalette});
paletteView.render();

//  TODO refactor and move to proper backbone classes
$(function () {
    var scrWidth = $("#page-content").width();
    var treeContainer = $("#tree-container");
    var rightContainer = $("#right-container");
    //TODO: remove
    treeContainer.resizable({
        ghost: false,
        minWidth: scrWidth / 16,
        maxWidth: scrWidth / 2,
        resize: function (event, el) {
           // rightContainer.css("width", scrWidth - el.size.width);
        }
    });

    var toolContainer = $("#tool-palette");
    var editorContainer = $("#editor-container");
    var propertyContainer = $(".property-container");
    //toolContainer.width(scrWidth / 8);
    toolContainer.resizable({
        ghost: false,
        minWidth: 170,
        maxWidth: rightContainer.width() / 3,
        resize: function (event, el) {
            editorContainer.css("width", rightContainer.innerWidth() - toolContainer.outerWidth(true) - propertyContainer.outerWidth(true));
        }
    });

    var tree = new Tree({
        root: new TreeItem({
            name: "MyProj",
            isDir: true,
            children: new TreeItemList([
                new TreeItem({
                    name: "Dir",
                    isDir: true,
                    children: new TreeItemList([new TreeItem({name: "MyAP2"})])
                }),
                new TreeItem({name: "MyAP3"})])
        })
    });
    new TreeView({model: tree}).render();
    tree.on("select",function (e) {
        console.log(e.path);
        console.log(e.name);
    });


});

// Create the model for the diagram
var diagram = new Diagrams.Models.Diagram({});
var definedConstants = [];

function TreeNode(value, type, cStart, cEnd) {
    this.object = undefined;
    this.children = [];
    this.value = value;
    this.type = type;
    this.configStart = cStart;
    this.configEnd = cEnd;

    this.getChildren = function () {
        return this.children;
    };

    this.getValue = function () {
        return this.value;
    };
}

function initTabs(){

    // Configuring dynamic  tab support
    var tab = new Diagrams.Models.Tab({
        resourceId: "seq_1",
        hrefId: "#seq_1",
        resourceTitle: "Resource",
        createdTab: false
    });

    var tabListView = new Diagrams.Views.TabListView({model: tab});
    tabListView.render(tab);
    var diagramObj1 = new Diagrams.Models.Diagram({});
    tab.addDiagramForTab(diagramObj1);
    var tabId1 = tab.get("resourceId");
    var linkId1 = tab.get("hrefId");
    //Enabling tab activation at page load
    $('.tabList a[href="#' + tabId1 + '"]').tab('show');
    var dgModel1 = tab.getDiagramOfTab(tab.attributes.diagramForTab.models[0].cid);
    dgModel1.CurrentDiagram(dgModel1);
    var svgUId1 = tabId1 + "4";
    var options = {selector: linkId1, wrapperId: svgUId1};
    // get the current diagram view for the tab
    var currentView1 = dgModel1.createDiagramView(dgModel1, options);
    // set current tab's diagram view as default view
    currentView1.currentDiagramView(currentView1);
    tab.setDiagramViewForTab(currentView1);
    // mark tab as visited
    tab.setSelectedTab();
    var preview = new Diagrams.Views.DiagramOutlineView({mainView: currentView1});
    preview.render();
    tab.preview(preview);

    addInitialElements(tabListView);

}
/**
 * This function will add Source and Resource lifelines to the Diagram model and invoke the Diagram.render method and
 * create initial arrow between source and resource.
 * @param tabListView
 */
function addInitialElements(tabListView){
    var model = defaultView.model;

    var centerPoint = createPoint(200, 50);
    var type = "Source";
    var lifeLineDef = MainElements.lifelines.SourceLifeline;

    var resourceCenterPoint = createPoint(380, 50);
    var resourceType = "Resource";
    var resourceLifeLineDef = MainElements.lifelines.ResourceLifeline;

    var resourceLifeline = createLifeLine("Resource", resourceCenterPoint, resourceLifeLineDef.class, resourceLifeLineDef.utils,
        resourceLifeLineDef.parameters, resourceLifeLineDef.textModel, resourceType);

    resourceLifeLineOptions.class = MainElements.lifelines.ResourceLifeline.class;
    //SETTING TOP SVG ELEMENT IN OPTIONS To Draw messages
    resourceLifeLineOptions.diagram = defaultView.model;
    model.addElement(resourceLifeline, resourceLifeLineOptions);
    model.resourceLifeLineCounter(1);

    var lifeline = createLifeLine("Source", centerPoint, lifeLineDef.class, lifeLineDef.utils,
        lifeLineDef.parameters, lifeLineDef.textModel, type);

    lifeLineOptions.class = MainElements.lifelines.SourceLifeline.class;
    //SETTING TOP SVG ELEMENT IN OPTIONS To Draw messages
    lifeLineOptions.diagram = defaultView.model;
    model.addElement(lifeline, lifeLineOptions);
    model.sourceLifeLineCounter(1);

    var position = new GeoCore.Models.Point({x: 0, y: 0});

    var processor = new SequenceD.Models.ProcessorFactory(Processors.actions.startAction.title,
        position,
        Processors.actions.startAction.type,
        {
            type: Processors.actions.startAction.type,
            initMethod: Processors.actions.startAction.init
        },
        {
            colour: Processors.actions.startAction.colour
        },
        Processors.actions.startAction.parameters,
        Processors.actions.startAction.utils);

    resourceLifeline.addChild(processor);

    //create initial arrow between source and resource
    var currentSource = defaultView.model.diagramSourceElements().models[0];
    var currentResource = defaultView.model.diagramResourceElements().models[0];
    tabListView.addInitArrow(currentSource,processor,defaultView);
    defaultView.render();
}

$(document).ready(function(){
    $("#empty-workspace-wrapper").show();
    $("#resource-tabs-wrapper").hide();
    $("#breadcrumbRow").hide();
    $("#serviceAndSourceButtonsRow").hide();
});


