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
requirejs.config({
    baseUrl: window.location.protocol + "//" + window.location.host + window.location.pathname.split("/").slice(0, -1).join("/"),
    paths: {
        lib: "lib",
        app: "js",
        /////////////////////////
        // third party modules //
        ////////////////////////
        jquery: "lib/jquery_v1.9.1/jquery-1.9.1.min",
        jquery_ui: "lib/jquery-ui_v1.12.1/jquery-ui",
        bootstrap: "lib/bootstrap_v3.3.6/js/bootstrap",
        d3: "lib/d3_v4.1.1/d3",
        log4javascript: "lib/log4javascript-1.4.13/log4javascript",
        lodash: "lib/lodash_v4.13.1/lodash",
        backbone: "lib/backbone_v1.3.3/backbone",
        svg_pan_zoom: "lib/svg-panNZoom/jquery.svg.pan.zoom",
        js_tree: "lib/js-tree-v3.3.2/jstree",
        nano_scroller: "lib/nanoscroller_0.8.7/jquery.nanoscroller.min",
        theme_wso2: "lib/theme-wso2_1.0/js/theme-wso2",
        ace: "lib/ace",
        beautify: "lib/beautify/beautify",
        ///////////////////////
        // custom modules ////
        //////////////////////
        log: "js/log/log",
        d3utils: "js/utils/d3-utils",
        diagram_core: "js/diagram-core/module",
        ballerina: "js/ballerina/module",
        ballerina_models: "js/ballerina/models/",
        command: "js/command/command",
        drag_drop_manager: "js/drag-drop/manager",
        main_elements: "js/main-elements/module",
        processors: "js/processors/module",
        tool_palette: "js/tool-palette/module",
        file_browser: "js/file-browser/file-browser",
        dialogs: "js/dialog/module",
        file_menu: "js/ballerina-menu-bar/file-menu",
        edit_menu: "js/ballerina-menu-bar/edit-menu",
        menu_bar_provider: "js/ballerina-menu-bar/module",
        menu_bar: "js/menu-bar/menu-bar",
        tool_bar: "js/tool-bar/tool-bar",
        tab: "js/tab/",
        alerts: "js/utils/alerts",
        resource_utils: "js/utils/resource-utils",
        breadcrumbs: "js/breadcrumbs/breadcrumbs",
        tree_node: "js/ast/node"
    },
    map: {
        "*": {
            // use lodash instead of underscore
            underscore: "lodash",
            jQuery: "jquery"
        }
    },
    packages: [
        {
            name: 'welcome',
            location: 'js/welcome-screen',
            main: 'module'
        },
        {
            name: 'tree_view',
            location: 'js/tree-view',
            main: 'module'
        },
        {
            name: 'workspace',
            location: 'js/workspace',
            main: 'module'
        }
    ]
});