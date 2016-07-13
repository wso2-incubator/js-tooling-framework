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

var paper = "#mainPaper";

var lifeLine1Model = new SequenceD.Models.LifeLine({title:"LifeLine1", centerPoint: new graphics_core.Models.Point({x: 250, y: 50})});
var lifeLine1 = new SequenceD.Views.LifeLineView({model:lifeLine1Model});
lifeLine1.render();

var lifeLine2Model = new SequenceD.Models.LifeLine({title:"LifeLine2", centerPoint: new graphics_core.Models.Point({x: 500, y: 50})});
var lifeLine2 = new SequenceD.Views.LifeLineView({model:lifeLine2Model});
lifeLine2.render();
