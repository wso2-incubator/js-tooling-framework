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
define([], function () {
    function ResourceConfigs() {
        this._base = "";
    }

    ResourceConfigs.getContextAwarePath = function (relative_path) {
        if (typeof this._base === 'undefined') {
            this._base = "";
        }
        return this._base + relative_path;
    };

    ResourceConfigs.setContextRoot = function (context_root) {
        this._base = context_root;
    };

    return ResourceConfigs;

});