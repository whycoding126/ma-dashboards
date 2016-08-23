/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var queryBuilder = function queryBuilder(cssInjector) {
    cssInjector.injectLink(require.toUrl('./queryBuilder.css'), 'queryBuilder');
    this.queryParts = [];
    
    this.$onInit = function() {
        this.ngModelCtrl.$parsers.unshift(this.parser);
        this.ngModelCtrl.$formatters.push(this.formatter);
        this.ngModelCtrl.$render = this.render;
    };
    
    this.parser = function parser(value) {
        // turn object into RQL
        console.log('parse ' + value);
        return value.join('&');
    }.bind(this);
    
    this.formatter = function formatter(value) {
        // parse RQL and turn into object
        console.log('format ' + value);
        return value.split('&');
    }.bind(this);
    
    this.render = function render() {
        this.queryParts = angular.copy(this.ngModelCtrl.$viewValue);
    }.bind(this);
    
    this.updateModel = function() {
        this.ngModelCtrl.$setViewValue(angular.copy(this.queryParts));
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
