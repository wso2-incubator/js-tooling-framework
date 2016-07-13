var paper = "#mainPaper";

var lifeLine1Model = new SequenceD.Models.LifeLine({title:"LifeLine1", centerPoint: new graphics_core.Models.Point({x: 250, y: 50})});
var lifeLine1 = new SequenceD.Views.LifeLineView({model:lifeLine1Model});
lifeLine1.render();

var lifeLine2Model = new SequenceD.Models.LifeLine({title:"LifeLine2", centerPoint: new graphics_core.Models.Point({x: 500, y: 50})});
var lifeLine2 = new SequenceD.Views.LifeLineView({model:lifeLine2Model});
lifeLine2.render();
