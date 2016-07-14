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
        return parent.draw.circle(point.x(), point.y(), r);
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
        return parent.draw.rect(center.x() - width/2, center.y() - height/2, width, height, rx, ry, parent);
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
        return parent.draw.line(start.x(), start.y(), start.x(), start.y() + height, parent);
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
        return parent.draw.textElement(center.x(), center.y(), textContent, parent).attr('text-anchor', 'middle');
    };

    var lifeLine = function (center, title, prefs) {
        var group = d3Ref.draw.group()
                        .classed(prefs.class, true);
        var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 10, 10, group)
                            .classed(prefs.rect.class, true);
        var line = d3Ref.draw.verticalLine(center, prefs.line.height, group)
                            .classed(prefs.line.class, true);
        var text = d3Ref.draw.centeredText(center, title, group)
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
        var draw = {};
        draw.centeredRect = centeredRect;
        draw.rect = rect;
        draw.line = line;
        draw.verticalLine = verticalLine;
        draw.editableText = editableText;
        draw.centeredText = centeredText;
        draw.textElement = textElement;
        draw.circle = circle;
        draw.circleOnPoint = circleOnPoint;
        draw.lifeLine = lifeLine;
        draw.group = group;

        var d3Proto = Object.getPrototypeOf(d3ref);
        d3Proto.draw = draw;

        return d3Ref = d3ref;
    };

    var d3 = function(){
      return d3Ref;
    };

    d3_draw.wrap = wrap;

    return d3_draw;

}(d3_draw || {}));