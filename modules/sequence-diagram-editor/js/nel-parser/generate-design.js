//TODO check for internal endpoint parsing
//TODO error in source
//TODO delete defaultView
var tabListView;
var currentResourceModel;
var sourceToDesign = function (treeObject) {
    console.log("sourceDesign" + treeObject);
    var view = setCurrentDiagramView(treeObject);
    //defaultView = view;
    traverseTree(treeObject, view.model, view);
    view.render();
};

var traverseTree = function (node, model, view) {
    if (node.type === "Service") {
        //TODO add parameters
        console.log("service");
        var parameters = [
            {
                key: "title",
                value: "Source"
            }
        ];
        MainElements.lifelines.SourceLifeline.utils.createMyModel(model, parameters);
        //TODO remove this render and fix source rectangle issue
        view.render();
        node.children.forEach(function (child) {
            traverseTree(child, model, view);
        });
    } else if (node.type === "Resource") {
        console.log("resource");
        var parameters = [
            {
                key: "title",
                value: getParameterValue(node.parameters, "title")
            },
            {
                key: "path",
                value: getParameterValue(node.parameters,"path")
            },
            {
                key: "get",
                value: getParameterValue(node.parameters,"get")
            },
            {
                key: "put",
                value: getParameterValue(node.parameters,"put")
            },
            {
                key: "post",
                value: getParameterValue(node.parameters,"post")
            }
        ];
        var resourceLifeline = MainElements.lifelines.ResourceLifeline.utils.createMyModel(model, parameters);
        var processor = MainElements.lifelines.ResourceLifeline.utils.createMyStartProcessorModel(resourceLifeline);
        //create initial arrow between start processor and resource
        var currentSource = view.model.diagramSourceElements().models[0];
        addInitArrow(currentSource, processor, view);

        node.children.forEach(function (child) {
            traverseTree(child, model.get('diagramResourceElements').models[0], view);
        });

    } else if (node.type === "Endpoint") {
        //TODO add parameters
        var centerPoint = createPoint(0, 50);

        var title = "StockEp";
        var parameters = [
            {
                key: "title",
                value: getParameterValue(node.parameters,"title")
            },
            {
                key: "url",
                value: getParameterValue(node.parameters,"url")
            }
        ];
        MainElements.lifelines.EndPointLifeline.utils.createMyModel(model, title, centerPoint, parameters);

    } else if (node.type == "InvokeMediator") {
        console.log("invoke");
        //TODO add parameter
        var invokeModel = Processors.manipulators.InvokeMediator.utils.createMyModel(model);

        var startPoint = new GeoCore.Models.Point({x: 0, y: 0}),
            endpoint = new GeoCore.Models.Point({x: 0, y: 0});


        var sourcePoint = new SequenceD.Models.MessagePoint({
            model: {type: "messagePoint"},
            x: startPoint.x(),
            y: startPoint.y(),
            direction: "outbound"
        });
        var destinationPoint = new SequenceD.Models.MessagePoint({
            model: {type: "messagePoint"},
            x: endpoint.x(),
            y: endpoint.y(),
            direction: "inbound"
        });
        var messageLink = new SequenceD.Models.MessageLink({
            source: sourcePoint,
            destination: destinationPoint,
            type: 2
        });


        //TODO get endpointRef and get the endpoint
        var destinationModel = getEndpoint("", view.model);
        if (destinationModel) {

            var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
            var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
            invokeModel.outputConnector(sourcePoint);
            destinationModel.addChild(destinationPoint, messageOptionsInbound);

        }

    } else if (node.type === "ResponseMsg") {
        console.log("response");
        var responseProcessor = Processors.manipulators.replyProcessor.utils.createMyModel(model, view);

    } else if (node.type === "LogMediator") {
        console.log("log");
        //TODO set parameters
        var parameters = [
            {
                key: "messageRef",
                value: Processors.manipulators.LogMediator.parameters[0].value
            },
            {
                key: "message",
                value:Processors.manipulators.LogMediator.parameters[1].value
            },
            {
                key: "logLevel",
                value: getParameterValue(node.parameters,"level")
            },
            {
                key: "logCategory",
                value: Processors.manipulators.LogMediator.parameters[3].value
            },
            {
                key: "description",
                value: getParameterValue(node.parameters,"status")
            }
        ];
         var logMediator = Processors.manipulators.LogMediator.utils.createMyModel(model, parameters);
        // var position = new GeoCore.Models.Point({
        //     x: 0,
        //     y: 0
        // });
        // var processor = model.createProcessor(
        //     Processors.manipulators.LogMediator.title,
        //     position,
        //     Processors.manipulators.LogMediator.id,
        //     {
        //         type: Processors.manipulators.LogMediator.type || "UnitProcessor",
        //         initMethod: Processors.manipulators.LogMediator.init
        //     },
        //     {colour: Processors.manipulators.LogMediator.colour},
        //     Processors.manipulators.LogMediator.parameters,//TODO set param
        //     Processors.manipulators.LogMediator.utils
        // );
        //view.model.attributes.diagramResourceElements.models[0].attributes.children.models.push(processor);
        //view.render();
    } else if(node.type === "HeaderProcessor") {
        console.log("Header");
        var parameters = [
            {
                key: "reference",
                value: getParameterValue(node.parameters,"messageRef")
            },
            {
                key: "name",
                value: getParameterValue(node.parameters,"headerName")
            },
            {
                key: "value",
                value: getParameterValue(node.parameters,"headerValue")
            }
        ];
        var headerProcessor = Processors.manipulators.HeaderProcessor.utils.createMyModel(model, parameters);
    } else if(node.type === "TryCatchMediator") {
        console.log("trycatch");
    }
};

var getEndpoint = function (endpointRef, viewModel) {
    console.log("getEndpoint");
    //TODO check for the availability if the endpoint
       return viewModel.attributes.diagramEndpointElements.models[0];
};

var setCurrentDiagramView = function () {
    // var id = Math.random().toString(36).substr(2, 9);
    // var hrefId = '#seq_' + id;
    // var resourceId = 'seq_' + id;
    // var resourceModel = new Diagrams.Models.Tab({
    //     resourceId: resourceId,
    //     hrefId: hrefId,
    //     resourceTitle: "Resource",
    //     createdTab: false
    // });
    //
    // if (diagram.selectedOptionsGroup) {
    //     diagram.selectedOptionsGroup.classed("option-menu-hide", true);
    //     diagram.selectedOptionsGroup.classed("option-menu-show", false);
    // }
    // diagram.selectedOptionsGroup = null;
    // if (diagram.propertyWindow) {
    //     diagram.propertyWindow = false;
    //     defaultView.enableDragZoomOptions();
    //     $('#property-pane-svg').empty();
    // }
    //
    // var nextTabListView = new Diagrams.Views.TabListView({model: resourceModel});
    // tabListView = nextTabListView;
    // nextTabListView.render(resourceModel);
    // //create new diagram object for the tab
    // var diagramObj = new Diagrams.Models.Diagram({});
    // resourceModel.addDiagramForTab(diagramObj);
    //
    // //Activating tab on creation itself
    // $('.tabList a[href="#' + resourceId + '"]').tab('show');
    //var dgModel = resourceModel.getDiagramOfTab(resourceModel.attributes.diagramForTab.models[0].cid);
    // dgModel.CurrentDiagram(dgModel);
    // var svgUId = resourceId + "4";
    // var options = {selector: hrefId, wrapperId: svgUId};

    // get the current diagram view for the tab
    var currentView = defaultView;//dgModel.createDiagramView(dgModel, options);
    defaultView.model = new Diagrams.Models.Diagram({});
    // add diagramModel
    // var preview = new Diagrams.Views.DiagramOutlineView({mainView: currentView});
    // preview.render();
    // resourceModel.preview(preview);
    //
    // // set current tab's diagram view as default view
    // currentView.currentDiagramView(currentView);
    // resourceModel.setDiagramViewForTab(currentView);
    // // mark tab as visited
    // resourceModel.setSelectedTab();
    return defaultView;
};


// var addNewEmptyTab = function () {
//     var id = Math.random().toString(36).substr(2, 9);
//     var hrefId = '#seq_' + id;
//     var resourceId = 'seq_' + id;
//     var resourceModel = new Diagrams.Models.Tab({
//         resourceId: resourceId,
//         hrefId: hrefId,
//         resourceTitle: "Resource",
//         createdTab: false
//     });
//
//     if (diagram.selectedOptionsGroup) {
//         diagram.selectedOptionsGroup.classed("option-menu-hide", true);
//         diagram.selectedOptionsGroup.classed("option-menu-show", false);
//     }
//     diagram.selectedOptionsGroup = null;
//     if (diagram.propertyWindow) {
//         diagram.propertyWindow = false;
//         defaultView.enableDragZoomOptions();
//         $('#property-pane-svg').empty();
//     }
//
//     var nextTabListView = new Diagrams.Views.TabListView({model: resourceModel});
//     tabListView = nextTabListView;
//     nextTabListView.render(resourceModel);
//     //create new diagram object for the tab
//     var diagramObj = new Diagrams.Models.Diagram({});
//     resourceModel.addDiagramForTab(diagramObj);
//
//     //Activating tab on creation itself
//     $('.tabList a[href="#' + resourceId + '"]').tab('show');
//     var dgModel = resourceModel.getDiagramOfTab(resourceModel.attributes.diagramForTab.models[0].cid);
//     dgModel.CurrentDiagram(dgModel);
//     var svgUId = resourceId + "4";
//     var options = {selector: hrefId, wrapperId: svgUId};
//
//     // get the current diagram view for the tab
//     var currentView = dgModel.createDiagramView(dgModel, options);
//     // add diagramModel
//     var preview = new Diagrams.Views.DiagramOutlineView({mainView: currentView});
//     preview.render();
//     resourceModel.preview(preview);
//
//     // set current tab's diagram view as default view
//     currentView.currentDiagramView(currentView);
//     resourceModel.setDiagramViewForTab(currentView);
//     // mark tab as visited
//     resourceModel.setSelectedTab();
//     return currentView;
// };

var getParameterValue = function (parameters, key) {
    var value = "";
    parameters.forEach(function (parameter) {
       if( parameter.key === key) {
           value = parameter.value;
       }
    });
    return value;
};

var addInitArrow = function(source,destination,diagramView){
    centerS = createPoint(200, 50);
    centerR = createPoint(380, 50);
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
        priority: destinationPoint,
        type : Diagrams.Utils.messageLinkType.OutOnly
    });
    var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
    var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
    source.addChild(sourcePoint, messageOptionsOutbound);
    destination.inputConnector(destinationPoint);
};

var addChild = function (model, element, opts, index) {
    //this.children().add(element, opts);

    element.parent(model);
    if (element instanceof SequenceD.Models.Processor) {
        // var position = this.calculateIndex(element, element.get('centerPoint').get('y'));
        // var index = position.index;
        model.children().push(element);
    } else if (!_.isUndefined(opts)) {
        //diagram.addElement(element, opts);
        // element is a message point
        // var position = this.calculateIndex(element, element.y());
        // var index = position.index;
        //model.children().push(element);
        model.attributes.children.models[index] = element;
    }

    //this.trigger("addChild", element, opts);
    //this.trigger("addChildProcessor", element, opts);
};
