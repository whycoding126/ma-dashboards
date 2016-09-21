/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';

    var watchListChart = function($mdMedia, $timeout, MD_ADMIN_SETTINGS) {
        return {
            restrict: 'E',
            scope: {
                addChecked: '='
            },
            templateUrl: 'directives/watchList/watchListChart.html',
            link: function link(scope, element, attrs) {
                
                scope.dateBar = MD_ADMIN_SETTINGS.dateBar;
                
                scope.graphOptions = [];
                
                scope.parseInt = parseInt; // Make parseInt available to scope
                scope.parseFloat = parseFloat; // Make parseFloat available to scope
                scope.stats = []; // Set up array for storing stats for stats tab
                scope.points = []; // Set up array for storing charted points
                scope.$mdMedia = $mdMedia; // Make $mdMedia service available to scope

                scope.$watchCollection('addChecked', function(newValues, oldValues) {
                    if (newValues === undefined || newValues === oldValues) return;
                    
                    if(newValues.length > oldValues.length) {
                        scope.graphOptions.push({valueAxis: scope.selectedAxis});
                    }
                    else if (newValues.length < oldValues.length) {
                        // Need to splice at index of removed point rather then pop off at end!
                        scope.graphOptions.pop();
                    }

                    // Clear
                    scope.stats = [];
                    scope.points = [];
                    // assign the chart's points equal to the checked from table
                    scope.points = newValues;
                    // console.log(newValues);
                });

            } // End Link
        }; // End return
    }; // End DDO

    watchListChart.$inject = ['$mdMedia', '$timeout', 'MD_ADMIN_SETTINGS'];

    return watchListChart;

}); // define