var paper = "#svgArea";

var lifeLine1 = new SequenceD.Views.LifeLineView({title:" LifeLine1", centerPoint: new graphics_core.Models.Point({x: 250, y: 250})});
lifeLine1.render(paper);

var lifeLine2 = new SequenceD.Views.LifeLineView({title:" LifeLine2", centerPoint: new graphics_core.Models.Point({x: 500, y: 250})});
lifeLine2.render(paper);

var lifeLine3 = new SequenceD.Views.LifeLineView({title:" LifeLine3", centerPoint: new graphics_core.Models.Point({x: 750, y: 250})});
lifeLine3.render(paper);