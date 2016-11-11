var sourceToDesign = function (treeObject) {
    console.log("sourceDesign" + treeObject);
    var view = addNewEmptyTab(treeObject);
    traverseTree(treeObject, view.model, view);
    view.render();
};

var traverseTree = function (node, model, view) {
    console.log("traverse" + node);
    if (node.type === "Resource") {
        console.log("resource");
        var parameters = node.parameters;
        model.get('diagramResourceElements').models[0].attributes.parameters = node.parameters;

        node.children.forEach(function (child) {
            traverseTree(child, model.get('diagramResourceElements').models[0], view);
        });

    } else if (node.type == "InvokeMediator") {
        console.log("invoke");

        var line = view.d3svg.append("line")
            .attr("x1", 0)//model.attributes.centerPoint.x())
            .attr("y1", 0)//model.attributes.centerPoint.y() + 100)
            .attr("x2", 0)//model.attributes.centerPoint.x())
            .attr("y2", 0)//model.attributes.centerPoint.y() + 100)
            .attr("marker-end", "url(#markerArrow)")
            .attr("class", "message");

        var startPoint = new GeoCore.Models.Point({x: line.attr("x1"), y: line.attr("y1")}),
            endpoint = new GeoCore.Models.Point({x: line.attr("x2"), y: line.attr("y2")});
        line.remove();

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
            destination: destinationPoint
        });

        if (!getEndpoint(node.parameters[0].value, view)) {

            var countOfEndpoints = view.model.endpointLifeLineCounter();
            //only one endpoint is allowed in this version TODO:
            if (countOfEndpoints === 0) {
                ++countOfEndpoints;
                view.renderMainElement("EndPoint", countOfEndpoints, MainElements.lifelines.EndPointLifeline);
                view.model.endpointLifeLineCounter(countOfEndpoints);
                view.model.attributes.diagramEndpointElements.models[0].attributes.parameters = [
                    {
                        key: "title",
                        value: node.parameters[0].value
                    },
                    {
                        key: "url",
                        value: "http://localhost:8080/stockquote/all"
                    }
                ];
                view.model.attributes.diagramEndpointElements.models[0].attributes.title = node.parameters[0].value;
            }//validation check for number of endpoints in a tab
            else {
                $('#endpointModal').modal('show');
            }
        }
        var destinationModel = view.model.attributes.diagramEndpointElements.models[0];


        var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
        var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
        console.log("invoke model children length"+model.children().models.length);
        addChild(model, sourcePoint, messageOptionsOutbound, model.children().models.length);
        //model.addChild(sourcePoint, messageOptionsOutbound, model.children().models.length);
        destinationModel.addChild(destinationPoint, messageOptionsInbound);
        view.render();
    } else if (node.type === "ResponseMsg") {
        console.log("response");
        var line = view.d3svg.append("line")
            .attr("x1", model.attributes.centerPoint.x())
            .attr("y1", model.attributes.centerPoint.y() + 100)
            .attr("x2", model.attributes.centerPoint.x())
            .attr("y2", model.attributes.centerPoint.y() + 100)
            .attr("marker-end", "url(#markerArrow)")
            .attr("class", "message");

        var startPoint = new GeoCore.Models.Point({x: line.attr("x1"), y: line.attr("y1")});
        var endpoint = new GeoCore.Models.Point({x: line.attr("x2"), y: line.attr("y2")});
        line.remove();

        var sourcePoint = new SequenceD.Models.MessagePoint({
            model: {type: "messagePoint"},
            x: startPoint.x(),
            y: startPoint.y(),
            direction: "inbound"
        });
        var destinationPoint = new SequenceD.Models.MessagePoint({
            model: {type: "messagePoint"},
            x: endpoint.x(),
            y: endpoint.y(),
            direction: "outbound"
        });
        var messageLink = new SequenceD.Models.MessageLink({
            source: sourcePoint,
            destination: destinationPoint
        });

        var destinationModel = view.model.attributes.diagramSourceElements.models[0];


        var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
        var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
        console.log(" resonse model children length"+model.children().models.length);
        addChild(model, sourcePoint, messageOptionsOutbound, model.children().models.length);
        //model.addChild(sourcePoint, messageOptionsOutbound, model.children().models.length);
        destinationModel.addChild(destinationPoint, messageOptionsInbound);
        view.render();
    } else if (node.type === "LogMediator") {
        console.log("log");
        var position = new GeoCore.Models.Point({
            x: 0,
            y: 0
        });
        var processor = model.createProcessor(
            Processors.manipulators.LogMediator.title,
            position,
            Processors.manipulators.LogMediator.id,
            {
                type: Processors.manipulators.LogMediator.type || "UnitProcessor",
                initMethod: Processors.manipulators.LogMediator.init
            },
            {colour: Processors.manipulators.LogMediator.colour},
            Processors.manipulators.LogMediator.parameters,//TODO set param
            Processors.manipulators.LogMediator.utils
        );
        view.model.attributes.diagramResourceElements.models[0].attributes.children.models.push(processor);
        view.render();
    }
};

var getEndpoint = function (endpointRef, view) {
    console.log("getEndpoint");
    //TODO check for the availability if the endpoint
    var endpoints = view.model.attributes.diagramEndpointElements.models;
    return null;
};

var addNewEmptyTab = function (root) {
    var id = Math.random().toString(36).substr(2, 9);
    var hrefId = '#seq_' + id;
    var resourceId = 'seq_' + id;
    var resourceModel = new Diagrams.Models.Tab({
        resourceId: resourceId,
        hrefId: hrefId,
        resourceTitle: "Generated Resource",
        createdTab: false
    });

    if (diagram.selectedOptionsGroup) {
        diagram.selectedOptionsGroup.classed("option-menu-hide", true);
        diagram.selectedOptionsGroup.classed("option-menu-show", false);
    }
    diagram.selectedOptionsGroup = null;
    if (diagram.propertyWindow) {
        diagram.propertyWindow = false;
        defaultView.enableDragZoomOptions();
        $('#property-pane-svg').empty();
    }

    var nextTabListView = new Diagrams.Views.TabListView({model: resourceModel});
    nextTabListView.render(resourceModel);
    //create new diagram object for the tab
    var diagramObj = new Diagrams.Models.Diagram({});
    resourceModel.addDiagramForTab(diagramObj);

    //Activating tab on creation itself
    $('.tabList a[href="#' + resourceId + '"]').tab('show');
    var dgModel = resourceModel.getDiagramOfTab(resourceModel.attributes.diagramForTab.models[0].cid);
    dgModel.CurrentDiagram(dgModel);
    var svgUId = resourceId + "4";
    var options = {selector: hrefId, wrapperId: svgUId};

    // get the current diagram view for the tab
    var currentView = dgModel.createDiagramView(dgModel, options);
    // add diagramModel
    var preview = new Diagrams.Views.DiagramOutlineView({mainView: currentView});
    preview.render();
    resourceModel.preview(preview);

    // set current tab's diagram view as default view
    currentView.currentDiagramView(currentView);
    resourceModel.setDiagramViewForTab(currentView);
    // mark tab as visited
    resourceModel.setSelectedTab();
    currentView.renderMainElement("Source", 1, MainElements.lifelines.SourceLifeline);
    currentView.model.sourceLifeLineCounter(1);
    if (root.type == "Resource") {
        currentView.renderMainElement("Resource", 1, MainElements.lifelines.ResourceLifeline);
        currentView.model.resourceLifeLineCounter(1);
        // first arrow creation between source and resource
        var currentSource = currentView.model.diagramSourceElements().models[0];
        var currentResource = currentView.model.diagramResourceElements().models[0];
        drawInitArrow(currentSource, currentResource, currentView);
    }
    return currentView;
};


var addChild =  function (model, element, opts, index) {
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


var drawInitArrow = function (source, destination, diagramView) {
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
        destination: destinationPoint
    });
    var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
    var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
    source.addChild(sourcePoint, messageOptionsOutbound);
    destination.addChild(destinationPoint, messageOptionsInbound);
};
