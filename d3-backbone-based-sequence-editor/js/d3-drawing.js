var d3_draw = (function (d3_draw) {

    var d3Ref = undefined;

    var circle = function(cx,cy,r){
        return d3Ref.append("circle")
            .attr("cx",cx)
            .attr("cy",cy)
            .attr("r",r);
    };

    var circleOnPoint = function(point,r){
        return d3Ref.circle(point.getX(), point.getY(), r);
    };

    var rect = function(x,y,width,height,rx,ry){
        rx = rx || 0;
        ry = ry || 0;
        return d3Ref.append("rect")
            .attr("x",x)
            .attr("y",y)
            .attr("width",width)
            .attr("height",height)
            .attr("rx",rx)
            .attr("ry",ry);
    };

    /**
     * Draws a rectangle which is centered to a given point in the paper.
     *
     * @param center GraphicsCore.Models.Point object which maps the center point.
     * @param width  Width of the
     * @param height
     * @param rx
     * @param ry
     */
    var centeredRect = function(center, width, height, rx, ry){
        rx = rx || 0;
        ry = ry || 0;
        return d3Ref.rect(center.getX() - width/2, center.getY() - height/2, width, height, rx, ry);
    };


    var line = function(x1, y1, x2, y2){
       return d3Ref.append("line")
           .attr("x1",x1)
           .attr("y1",y1)
           .attr("x2",x2)
           .attr("y2",y2);
    };

    var horizontalLine = function(start, height){
        return d3Ref.line(start.getX(), start.getY(), start.getX(), start.getY() + height);
    };

    var editableText = function(x, y, text){

    };

    var textElement = function(x, y, textContent){
        return d3Ref.append("text")
            .attr("x",x)
            .attr("y",y)
            .text(function () {
                return  textContent;
            });
    };

    var centeredText = function(center, textContent){
        return d3Ref.textElement(center.getX(), center.getY(), textContent).attr('text-anchor', 'middle');
    };

    var lifeLine = function (center, title, prefs) {
        var rect = d3Ref.centeredRect(center, prefs.rect.width, prefs.rect.height).classed(prefs.rect.class, true);
        var line = d3Ref.horizontalLine(center, prefs.line.height).classed(prefs.line.class, true);
        var text = d3Ref.centeredText(center, title).classed(prefs.text.class, true);
        var group = d3Ref.group([rect, line, text]);
        return group;
    };

    var group = function(elements){
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
        d3Ref.__proto__.centeredRect = centeredRect;
        d3Ref.__proto__.rect = rect;
        d3Ref.__proto__.line = line;
        d3Ref.__proto__.horizontalLine = horizontalLine;
        d3Ref.__proto__.editableText = editableText;
        d3Ref.__proto__.centeredText = centeredText;
        d3Ref.__proto__.textElement = textElement;
        d3Ref.__proto__.circle = circle;
        d3Ref.__proto__.circleOnPoint = circleOnPoint;
        d3Ref.__proto__.lifeLine = lifeLine;
        d3Ref.__proto__.group = group;

        return d3Ref;
    };

    var d3 = function(){
      return d3Ref;
    };

    d3_draw.wrap = wrap;

    return d3_draw;

}(d3_draw || {}));