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

var SequenceD = (function (sequenced) {
    var views = sequenced.Views || {};

    var ProcessorViewFactory = function (center, model) {
        var processor;

        var title = model.get("title");
        var type = model.get("type");

        if (type === "UnitProcessor") {
            processor = new SequenceD.Views.UnitProcessorView(
                {
                    model: model,
                    options: lifeLineOptions
                }, title
            );
        } else if (type === "Action") {
            processor = new SequenceD.Views.ActionProcessorView(
                {
                    model: model,
                    options: lifeLineOptions
                }
            );
        } else if (type === "ComplexProcessor") {
            processor = new SequenceD.Views.ComplexProcessorView(
                {
                    model: model,
                    options: lifeLineOptions
                }, title
            );
        } else if (type === "DynamicContainableProcessor") {
            processor = new SequenceD.Views.DynamicContainableProcessorView(
                {
                    model: model,
                    options: lifeLineOptions
                }, title
            );
        }  else if (type === "MultiRegionHolderProcessor") {
            processor = new SequenceD.Views.MultiRegionHolderProcessorView(
                {
                    model: model,
                    options: lifeLineOptions
                }
            );
        } else if (type === "CustomProcessor") {
            processor = new SequenceD.Views.CustomProcessorView(
                {
                    model: model,
                    options: lifeLineOptions
                }, title
            );
        }

        processor.type = type;

        return processor;
    };

    views.ProcessorViewFactory = ProcessorViewFactory;
    sequenced.Views = views;

    return sequenced;

}(SequenceD || {}));