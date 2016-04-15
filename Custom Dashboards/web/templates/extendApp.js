/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([
    'angular',
    'mango-3.0/maMaterialDashboards'
], function(angular, maMaterialDashboards) {
'use strict';

var myApp = angular.module('myApp', ['maMaterialDashboards']);

myApp.run(['$rootScope', function($rootScope) {
    $rootScope.pi = function() {
        return Math.PI;
    }
}]);

myApp.directive('myCustomComponent', function() {
    return {
        restrict: 'E',
        scope: {
            name: '@'
        },
        template: '<span>Hello {{name}}!</span>'
    };
});

angular.element(document).ready(function() {
    angular.bootstrap(document.documentElement, ['myApp']);
});

}); // define
