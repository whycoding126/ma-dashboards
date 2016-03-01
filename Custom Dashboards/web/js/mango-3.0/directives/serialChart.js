/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['amcharts/serial', 'jquery', 'moment'], function(AmCharts, $, moment) {
'use strict';

function serialChart() {
	var MAX_SERIES = 10;
	var scope = {
		options: '=?',
	    categoryFormat: '@',
	    stackType: '@'
	};
	for (var j = 1; j <= MAX_SERIES; j++) {
		scope['series' + j + 'Values'] = '=';
		scope['series' + j + 'Type'] = '@';
		scope['series' + j + 'Title'] = '@';
		scope['series' + j + 'Color'] = '@';
		scope['series' + j + 'Point'] = '=?';
	}
	
    return {
        restrict: 'E',
        replace: true,
        scope: scope,
        template: '<div class="amchart"></div>',
        link: function ($scope, $element, attributes) {
            var options = defaultOptions();

            if ($scope.categoryFormat) {
                options.categoryAxis.parseDates = false;
            }
            
            if ($scope.stackType) {
                options.valueAxes[0].stackType = $scope.stackType;
            }
            
            options = $.extend(options, $scope.options);
            
            var chart = AmCharts.makeChart($element[0], options);
            
            for (var i = 1; i <= MAX_SERIES; i++) {
        		$scope.$watchGroup([
        		    'series' + i + 'Type',
        		    'series' + i + 'Title',
        		    'series' + i + 'Color',
        		    'series' + i + 'Point'
        		], typeOrTitleChanged.bind(null, i));
        		
        		$scope.$watchCollection('series' + i + 'Values', valuesChanged.bind(null, i));
        	}
            
            function typeOrTitleChanged(graphNum, values) {
            	var somethingSet = false;
            	for (var i in values) {
            		if (values[i]) {
            			somethingSet = true;
            			break;
            		}
            	}
            	if (!somethingSet) return;
            	
            	setupGraph(graphNum);
            	chart.validateData();
            }
            
            function valuesChanged(graphNum, newValue) {
            	if (!newValue) removeGraph(graphNum);
                else setupGraph(graphNum);
                updateValues();
            }
            
            function removeGraph(graphNum) {
                for (var i = 0; i < chart.graphs.length; i++) {
                    if (chart.graphs[i].valueField === "value" + graphNum) {
                        chart.graphs.splice(i, 1);
                        break;
                    }
                }
            }
            
            function findGraph(graphNum) {
                var graph;
                for (var i = 0; i < chart.graphs.length; i++) {
                    if (chart.graphs[i].id === "series-" + graphNum) {
                        graph = chart.graphs[i];
                        break;
                    }
                }
                return graph;
            }
            
            function setupGraph(graphNum) {
                var graph = findGraph(graphNum);
                var point = $scope['series' + graphNum + 'Point'];
                
                var graphType = $scope['series' + graphNum + 'Type'] ||
                	(point && point.plotType.toLowerCase()) ||
                	'smoothedLine';
                
                // change mango plotType to amCharts graphType
                // step and line are equivalent
                if (graphType === 'spline') {
                	graphType = 'smoothedLine';
                }

                if (!graph) {
                    graph = {};
                    chart.graphs.push(graph);
                }
                $.extend(graph, graphType === 'column' ? defaultColumnGraph(graphNum) : defaultLineGraph(graphNum));
                graph.valueField = 'value' + graphNum;
                graph.title = $scope['series' + graphNum + 'Title'] ||
                	(point && point.name) ||
                	('Series ' + graphNum);
                graph.type = graphType;
                graph.lineColor = $scope['series' + graphNum + 'Color'] ||
                	(point && point.chartColour) ||
                	null;
                var stackType = options.valueAxes[0].stackType;
                if (stackType && stackType !== 'none') {
                	graph.fillAlphas = 0.8;
                }
                
                chart.graphs.sort(function(a, b) {
                    if (a.id < b.id)
                        return -1;
                      if (a.id > b.id)
                        return 1;
                      return 0;
                });
            }
            
            function combine(output, newValues, valueField) {
                if (!newValues) return;
                
                for (var i = 0; i < newValues.length; i++) {
                    var value = newValues[i];
                    var category = $scope.categoryFormat ?
                            moment(value.timestamp).format($scope.categoryFormat) :
                            value.timestamp;
                    
                    if (!output[category]) {
                        output[category] = {category: category};
                    }
                    
                    output[category][valueField] = value.value;
                }
            }
            
            function updateValues() {
            	var values = $scope.categoryFormat ? {} : [];
            	
            	for (var i = 1; i <= MAX_SERIES; i++) {
            		var seriesValues = $scope['series' + i + 'Values'];
            		combine(values, seriesValues, 'value' + i);
            	}
                
                // normalize sparse array or object into dense array
                var output = [];
                for (var category in values) {
                    output.push(values[category]);
                }
                
                // XXX sparse array to dense array doesnt result in sorted array
                // manually sort here
                if (output.length && typeof output[0].category === 'number') {
                    output.sort(function(a,b) {
                        return a.category - b.category;
                    });
                }
                
                chart.dataProvider = output;
                chart.validateData();
            }
        }
    };
}

function defaultLineGraph(graphNum) {
    return {
        id: "series-" + graphNum,
        fillAlphas: 0,
        lineAlpha: 0.8,
        lineThickness: 2.0
    };
}

function defaultColumnGraph(graphNum) {
    return {
        id: "series-" + graphNum,
        fillAlphas: 0.8,
        lineAlpha: 0.9,
        lineThickness: 1
    };
}

function defaultOptions() {
    return {
        type: "serial",
        theme: "light",
        addClassNames: true,
        dataProvider: [],
        valueAxes: [{
            position: "left"
        }],
        categoryAxis: {
            parseDates: true,
            minPeriod: 'fff',
            equalSpacing: true
        },
        startDuration: 0,
        graphs: [],
        plotAreaFillAlphas: 0.0,
        categoryField: "category",
        'export': {
            enabled: false
        }
    };
}

return serialChart;

}); // define
