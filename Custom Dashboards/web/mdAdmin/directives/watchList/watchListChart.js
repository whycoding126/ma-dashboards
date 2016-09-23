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
                    
                    if(oldValues === undefined || newValues.length > oldValues.length) {
                        var graphOption = {valueAxis: scope.selectedAxis, xid: newValues[newValues.length-1].xid};
                        if (scope.assignColors) {
                            graphOption.lineColor = scope.selectedColor;
                        }
                        scope.graphOptions.push(graphOption);
                        console.log('Adding', newValues[newValues.length-1].xid);
                    }
                    else if (newValues.length < oldValues.length) {
                        var arrayDiff = oldValues.filter(function(x) { return newValues.indexOf(x) < 0 });
                        var removedXid = arrayDiff[0].xid;
                        var removedIndex = oldValues.map(function(x) {return x.xid; }).indexOf(removedXid);
                        
                        scope.graphOptions.splice(removedIndex, 1);
                        console.log('Removed', removedXid, 'at index', removedIndex);
                    }

                    // Clear
                    scope.stats = [];
                    scope.points = [];
                    // assign the chart's points equal to the checked from table
                    scope.points = newValues;
                    // console.log(newValues);
                    console.log('Graph Options', scope.graphOptions);
                });

            } // End Link
        }; // End return
    }; // End DDO

    watchListChart.$inject = ['$mdMedia', '$timeout', 'MD_ADMIN_SETTINGS'];

    return watchListChart;

}); // define