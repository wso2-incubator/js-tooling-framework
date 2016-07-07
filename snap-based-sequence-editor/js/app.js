var sampleLifeLine = new SequenceD.Views.LifeLine({centerPoint: new SequenceD.Models.Point({x: 200, y: 200}), title: "participant1"});
sampleLifeLine.render();


var sampleLifeLine2 = new SequenceD.Views.LifeLine({centerPoint: new SequenceD.Models.Point({x: 400, y: 200}), title: "participant2"});
sampleLifeLine2.render();


var sampleLifeLine2 = new SequenceD.Views.LifeLine({centerPoint: new SequenceD.Models.Point({x: 400, y: 200}), title: "participant3"});
sampleLifeLine2.render();














//var s = Snap("#svgArea");
//
//
//g.drag();
//
//
var myMatrix = new Snap.Matrix();
//myMatrix.scale(4,4);            // play with scaling before and after the rotate
//myMatrix.translate(200,100);      // this translate will not be applied to the rotation
//myMatrix.rotate(90,150,150);            // rotate
//myMatrix.scale(4,2);
//myMatrix.translate(100,0);    // this translate will take into account the rotated coord space
//g.animate({ transform: myMatrix.toTransformString() },1000);  // probably not needed

//var myInvertedMatrix = myMatrix.invert();
//
////g.animate({ transform: myMatrix },3000, mina.bounce, function() { g.animate({ transform: myInvertedMatrix }, 3000, mina.bounce) } );
//
////g.animate({ transform: myMatrix },3000 , mina.elastic, function(){
////
////    g.clone().animate({transform:new Snap.Matrix().translate(600, 100)}, 3000, mina.elastic);
////});
//
//g.clone().attr({transform: new Snap.Matrix().translate(300, 100)});
//g.clone().attr({transform: new Snap.Matrix().translate(400, 100)});
//g.clone().attr({transform: new Snap.Matrix().translate(500, 100)});
/**
 * Created by kavith on 7/6/16.
 */
