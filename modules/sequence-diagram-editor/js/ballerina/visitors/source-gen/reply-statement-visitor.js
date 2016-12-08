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
define(['lodash', 'log', 'event_channel', './statement-definition-visitor'], function(_, log, EventChannel, StatementDefinitionVisitor) {

    var ReplyStatementVisitor = function(){
        StatementDefinitionVisitor.call(this);
    };

    ReplyStatementVisitor.prototype = Object.create(StatementDefinitionVisitor.prototype);
    ReplyStatementVisitor.prototype.constructor = ReplyStatementVisitor;

    ReplyStatementVisitor.prototype.canVisitStatementDefinition = function(replyStatement){
        return true;
    };

    ReplyStatementVisitor.prototype.beginVisitStatementDefinition = function(replyStatement){
        log.info('Begin Visit Reply Statement Definition');
    };

    ReplyStatementVisitor.prototype.visitStatementDefinition = function(replyStatement){
        log.info('Visit Reply Statement Definition');
    };

    ReplyStatementVisitor.prototype.endVisitStatementDefinition = function(replyStatement){
        log.info('End Visit Reply Statement Definition');
    };

    return ReplyStatementVisitor;
});