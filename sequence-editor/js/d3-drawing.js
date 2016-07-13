var d3_draw = (function (d3_draw) {

    var d3Ref = undefined;

    var circle = function(cx, cy, r, parent){
        parent = parent || d3Ref;
        return parent.append("circle")
            .attr("cx",cx)
            .attr("cy",cy)
            .attr("r",r);
    };

    var circleOnPoint = function(point, r, parent){
        parent = parent || d3Ref;
        return parent.circle(point.getX(), point.getY(), r);
    };

    var rect = function(x, y, width, height, rx, ry, parent){
        parent = parent || d3Ref;
        rx = rx || 0;
        ry = ry || 0;
        return parent.append("rect")
            .attr("x",x)
            .attr("y",y)
            .attr("width",width)
            .attr("height",height)
            .attr("rx",rx)
            .attr("ry",ry);
    };

    var centeredRect = function(center, width, height, rx, ry, parent){
        parent = parent || d3Ref;
        rx = rx || 0;
        ry = ry || 0;
        return parent.rect(center.getX() - width/2, center.getY() - height/2, width, height, rx, ry, parent);
    };

    var line = function(x1, y1, x2, y2, parent){
       parent = parent || d3Ref;
       return parent.append("line")
           .attr("x1",x1)
           .attr("y1",y1)
           .attr("x2",x2)
           .attr("y2",y2);
    };

    var verticalLine = function(start, height, parent){
        parent = parent || d3Ref;
        return parent.line(start.getX(), start.getY(), start.getX(), start.getY() + height, parent);
    };

    var editableText = function(x, y, text){

    };

    var textElement = function(x, y, textContent, parent){
        parent = parent || d3Ref;
        return parent.append("text")
            .attr("x",x)
            .attr("y",y)
            .text(function () {
                return  textContent;
            });
    };

    var centeredText = function(center, textContent, parent){
        parent = parent || d3Ref;
        return parent.textElement(center.getX(), center.getY(), textContent, parent).attr('text-anchor', 'middle');
    };

    var lifeLine = function (center, title, prefs) {
        var group = d3Ref.group()
                        .classed(prefs.class, true);
        var rect = d3Ref.centeredRect(center, prefs.rect.width, prefs.rect.height, 10, 10, group)
                            .classed(prefs.rect.class, true);
        var line = d3Ref.verticalLine(center, prefs.line.height, group)
                            .classed(prefs.line.class, true);
        var text = d3Ref.centeredText(center, title, group)
                            .classed(prefs.text.class, true);
        Object.getPrototypeOf(group).rect = rect;
        Object.getPrototypeOf(group).line = line;
        Object.getPrototypeOf(group).title = text;
        return group;
    };

    var group = function(parent){
        parent = parent || d3Ref;
        return parent.append("g");
    };

    // FIXME: refactor to use native window methods
    var regroup = function(elements){
        var g = d3Ref.append("g");
        var $g = jQuery(g.node());
        elements.forEach(function(element){
            var $e = jQuery(element.node());
            $g.append($e.detach())
        });
        return g;
    };

    var wrap = function(d3ref){
        if( typeof d3ref === 'undefined'){
            throw "undefined d3 ref.";
        }
        d3Ref = d3ref;
        var d3Proto = Object.getPrototypeOf(d3Ref);
        d3Proto.centeredRect = centeredRect;
        d3Proto.rect = rect;
        d3Proto.line = line;
        d3Proto.verticalLine = verticalLine;
        d3Proto.editableText = editableText;
        d3Proto.centeredText = centeredText;
        d3Proto.textElement = textElement;
        d3Proto.circle = circle;
        d3Proto.circleOnPoint = circleOnPoint;
        d3Proto.lifeLine = lifeLine;
        d3Proto.group = group;

        return d3Ref;
    };

    var d3 = function(){
      return d3Ref;
    };

    d3_draw.wrap = wrap;

    return d3_draw;

}(d3_draw || {}));