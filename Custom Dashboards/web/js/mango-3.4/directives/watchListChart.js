/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';

    watchListChart.$inject = ['$mdMedia', '$timeout', 'DateBar', 'mdAdminSettings'];
    function watchListChart($mdMedia, $timeout, DateBar, mdAdminSettings) {
        return {
            restrict: 'E',
            scope: {
                addChecked: '=',
                chartConfig: '='
            },
            templateUrl: require.toUrl('./watchListChart.html'),
            link: function link(scope, element, attrs) {

                var defaultAxisColor = mdAdminSettings.theming.THEMES[mdAdminSettings.activeTheme].isDark ? '#FFFFFF' : '#000000';
                var defaultChartConfig = {
                    graphOptions: [],
                    selectedAxis: 'left',
                    selectedColor: '#C2185B',
                    assignColors: false,
                    chartType: 'smoothedLine',
                    stackType: {
                        selected: 'none',
                        left: 'none',
                        right: 'none',
                        'left-2': 'none',
                        'right-2': 'none'
                    },
                    axisColors: { 
                        left2AxisColor: defaultAxisColor,
                        leftAxisColor: defaultAxisColor,
                        right2AxisColor: defaultAxisColor,
                        rightAxisColor: defaultAxisColor
                    }
                };
                
                scope.dateBar = DateBar;
                scope.parseInt = parseInt; // Make parseInt available to scope
                scope.parseFloat = parseFloat; // Make parseFloat available to scope
                scope.stats = []; // Set up array for storing stats for stats tab
                scope.points = []; // Set up array for storing charted points
                scope.$mdMedia = $mdMedia; // Make $mdMedia service available to scope
                
                scope.clearChart = function() {
                    scope.points=[]; 
                    scope.stats=[]; 
                    scope.addChecked=[]; 
                    scope.chartConfig = defaultChartConfig;
                };
                
                scope.$watch('chartConfig.stackType.selected', function(newValue, oldValue) {
                    if (newValue === undefined || newValue === oldValue) return;
                    // console.log('stackType Updated:', newValue, scope.chartConfig.selectedAxis);
                    
                    scope.chartConfig.stackType[scope.chartConfig.selectedAxis] = newValue;

                    // console.log(scope.chartConfig);
                });

                scope.$watch('chartConfig.chartType', function(newValue, oldValue) {
                    if (newValue === undefined || newValue === oldValue) return;
                    // console.log('chartType Updated:', newValue, scope.chartConfig.selectedAxis);
                    
                    scope.chartConfig.graphOptions.filter(function(obj) {return obj.valueAxis === scope.chartConfig.selectedAxis}).forEach(function(obj) {obj.type = newValue});

                    // console.log(scope.chartConfig);
                });

                scope.$watch('chartConfig.selectedAxis', function(newValue, oldValue) {
                    if (newValue === undefined || newValue === oldValue) return;
                    // console.log('selectedAxis Updated:', newValue);
                    
                    // Set stackType control to that matching axis selected
                    scope.chartConfig.stackType.selected = scope.chartConfig.stackType ? scope.chartConfig.stackType[newValue] : 'none';

                    // Set chartType control to that matching axis selected
                    var selectedAxisGraphOption = scope.chartConfig.graphOptions.filter(function(obj) {return obj.valueAxis === newValue})[0];
                    scope.chartConfig.chartType = selectedAxisGraphOption ? selectedAxisGraphOption.type : 'smoothedLine';

                    // console.log(scope.chartConfig);
                });

                scope.$watchCollection('addChecked', function(newValues, oldValues) {
                    if (newValues === undefined || newValues === oldValues || (oldValues === undefined && newValues.length === 0)) return;
                    // console.log('addChecked Watcher:', newValues, oldValues);
                    
                    // If cleared from selecting a new watchlist clear stats and chartConfig.graphOptions
                    if (newValues.length === 0) {
                        scope.stats = [];
                        scope.chartConfig.graphOptions = [];
                    }
                    
                    // Clear Stats before new ones are generated
                    scope.stats = [];
                    
                    // assign the chart's points equal to the checked from table
                    scope.points = newValues;
                    
                    // Only add graph option if it isn't already in the chartConfig
                    var xidExists = scope.chartConfig.graphOptions.some(function(obj){return obj.xid === newValues[newValues.length-1].xid});
                    
                    if ( (oldValues === undefined && newValues.length >= 0 && !xidExists) || (newValues.length > oldValues.length && !xidExists) ) {
                        var graphOption = {valueAxis: scope.chartConfig.selectedAxis, xid: newValues[newValues.length-1].xid};
                        
                        graphOption.type = scope.chartConfig.chartType;

                        if (scope.chartConfig.assignColors) {
                            graphOption.lineColor = scope.chartConfig.selectedColor;
                        }
                        
                        scope.chartConfig.graphOptions.push(graphOption);
                        // console.log('Adding', newValues[newValues.length-1].xid);
                    }
                    else if (newValues.length < oldValues.length) {
                        var arrayDiff = oldValues.filter(function(x) { return newValues.indexOf(x) < 0 });
                        var removedXid = arrayDiff[0].xid;
                        var removedIndex = oldValues.map(function(x) {return x.xid; }).indexOf(removedXid);
                        
                        scope.chartConfig.graphOptions.splice(removedIndex, 1);
                        // console.log('Removed', removedXid, 'at index', removedIndex);
                    }

                    // console.log('Graph Options', scope.chartConfig.graphOptions);
                });

            } // End Link
        }; // End return
    }; // End DDO

    return watchListChart;

}); // define