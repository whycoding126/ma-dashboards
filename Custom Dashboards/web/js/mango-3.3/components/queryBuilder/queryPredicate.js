/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var queryPredicate = function queryPredicate(cssInjector) {
    this.operations = [
        {
            label: '=',
            value: 'eq'
        },
        {
            label: '~=',
            value: 'like'
        },
        {
            label: '>',
            value: 'gt'
        },
        {
            label: '>=',
            value: 'gte'
        },
        {
            label: '<',
            value: 'lt'
        },
        {
            label: '<=',
            value: 'lte'
        }
    ];
    this.predicate = {};
    
    this.$onInit = function() {
        this.ngModelCtrl.$parsers.unshift(this.parser);
        this.ngModelCtrl.$formatters.push(this.formatter);
        this.ngModelCtrl.$render = this.render;
    };
    
    this.parser = function parser(value) {
        // turn object into RQL
        console.log('parse ' + value);
        if (value.operation === 'eq') {
            return value.property + '=' + value.value;
        }
        return value.property + '=' + value.operation + '=' + value.value;
    }.bind(this);
    
    this.formatter = function formatter(value) {
        // parse RQL and turn into object
        console.log('format ' + value);
        
        var predicate = {
            property: 'name',
            operation: 'eq',
            value: ''
        };
        
        var parts = value.split('=');
        if (parts.length < 1) {
            return predicate;
        }
        predicate.property = parts[0];
        if (parts.length > 2) {
            predicate.operation = parts[1];
            predicate.value = parts[2];
        } else {
            predicate.value = parts[1];
        }
        
        return predicate;
    }.bind(this);
    
    this.render = function render() {
        this.predicate = angular.copy(this.ngModelCtrl.$viewValue);
    }.bind(this);
    
    this.updateModel = function() {
        this.ngModelCtrl.$setViewValue(angular.copy(this.predicate));
    };
};

queryPredicate.$inject = ['cssInjector'];

return {
    controller: queryPredicate,
    templateUrl: require.toUrl('./queryPredicate.html'),
    require: {
        'ngModelCtrl': 'ngModel'
    },
    bindings: {
        properties: '<'
    }
};

}); // define
