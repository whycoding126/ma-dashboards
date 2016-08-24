/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

var queryBuilder = function queryBuilder(cssInjector) {
    cssInjector.injectLink(require.toUrl('./queryBuilder.css'), 'queryBuilder');
    this.rootQueryNode = new query.Query();
    
    this.$onInit = function() {
        this.ngModelCtrl.$parsers.unshift(this.parser);
        this.ngModelCtrl.$formatters.push(this.formatter);
        this.ngModelCtrl.$render = this.render;
    };
    
    this.parser = function parser(value) {
        // turn object into RQL
        return value.toString();
    }.bind(this);
    
    this.formatter = function formatter(value) {
        // parse RQL and turn into object
        return new query.Query(value);
    }.bind(this);
    
    this.render = function render() {
        this.rootQueryNode = angular.copy(this.ngModelCtrl.$viewValue);
    }.bind(this);
    
    this.updateModel = function() {
        this.ngModelCtrl.$setViewValue(angular.copy(this.rootQueryNode));
    };
};

queryBuilder.$inject = ['cssInjector'];

return {
    controller: queryBuilder,
    templateUrl: require.toUrl('./queryBuilder.html'),
    require: {
        'ngModelCtrl': 'ngModel'
    },
    bindings: {
        properties: '<'
    }
};

}); // define
