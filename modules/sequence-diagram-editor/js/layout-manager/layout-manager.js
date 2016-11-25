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
define(['jquery', 'lodash', 'backbone', 'log', 'bootstrap'], function ($, _, Backbone, log) {

    // layout manager constructor
    /**
     * Arg: options
     * Here we should only include the layout specific handlers
     */
    return function (options) {
        if (!_.has(options, 'application')) {
            var error = "Application is not provided.";
            log.error(error);
            throw error;
        }
        this.$_application = _.get(options, 'application');

        if (_.isUndefined(this.$_application.commandManager)) {
            var error = "CommandManager is not initialized.";
            log.error(error);
            throw error;
        }

        this.$_expandShrinkFileExplorer = function (options, expand) {
            // When the event triggers for expanding the file explorer
            // add a left-margin to the tab-content
            if (expand) {
                $(_.get(options, 'right-container'))
                    .removeClass('left-container-default')
                    .addClass('left-container-expanded');
            } else {
                $(_.get(options, 'right-container'))
                    .removeClass('left-container-expanded')
                    .addClass('left-container-default');
            }
        };

        this.registerFileExplorerExpandAndShrinkHandler = function (command) {
            this.$_application.commandManager
                .registerHandler(command, this.$_expandShrinkFileExplorer);
        };

    }
});