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
define(['require','lodash', 'log', 'event_channel', './abstract-statement-source-gen-visitor', '../../ast/function-invocation'],
    function(require, _, log, EventChannel, AbstractStatementSourceGenVisitor, FunctionInvocation) {

        var FunctionInvocationVisitor = function(parent){
            AbstractStatementSourceGenVisitor.call(this,parent);
        };

        FunctionInvocationVisitor.prototype = Object.create(AbstractStatementSourceGenVisitor.prototype);
        FunctionInvocationVisitor.prototype.constructor = FunctionInvocationVisitor;

        FunctionInvocationVisitor.prototype.canVisitStatement = function(functionInvocation){
            return functionInvocation instanceof FunctionInvocation;
        };

        FunctionInvocationVisitor.prototype.beginVisitStatement = function(functionInvocation){
            var source = functionInvocation.getPackageName() + ':' + functionInvocation.getFunctionName() + '(';
            var params = functionInvocation.getParams();
            for (var id = 0; id < params.length; id ++) {
                if (id > 0) {
                    source += ',' + params[id];
                } else {
                    source += params[id];
                }
            }
            source += ')';
            this.appendSource(source);
            log.debug('Begin Visit Function Invocation expression');
        };

        FunctionInvocationVisitor.prototype.visitFuncInvocationStatement = function(functionInvocation){
            log.debug('Visit Function Invocation expression');
        };

        FunctionInvocationVisitor.prototype.endVisitStatement = function(functionInvocation){
            this.appendSource(";\n");
            this.getParent().appendSource(this.getGeneratedSource());
            log.info('End Visit Function Invocation expression');
        };

        return FunctionInvocationVisitor;
    });