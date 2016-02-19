/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['./services/Point',
        './services/PointEventManager',
        './services/translate',
        './directives/pointList',
        './directives/pointValue',
        './directives/pointValues',
        './directives/pointStatistics',
        './directives/bandStyle',
        './directives/switchStyle',
        './directives/tankLevel',
        './directives/gaugeChart',
        './directives/serialChart',
        './directives/pieChart',
        './directives/clock',
        './directives/stateChart',
        './directives/copyBlurred',
        './directives/tr',
        './directives/datePicker',
        './filters/momentFilter',
        './filters/trFilter',
        'angular',
        'angular-resource'
], function(Point, PointEventManager, translate, pointList, pointValue, pointValues, pointStatistics,
        bandStyle, switchStyle, tankLevel, gaugeChart, serialChart, pieChart, clock, stateChart, copyBlurred, tr, datePicker,
        momentFilter, trFilter, angular) {
'use strict';

var maDashboardApp = angular.module('maDashboardApp', ['ngResource']);

maDashboardApp.factory('Point', Point);
maDashboardApp.factory('PointEventManager', PointEventManager);
maDashboardApp.factory('translate', translate);
maDashboardApp.directive('maPointList', pointList);
maDashboardApp.directive('maPointValue', pointValue);
maDashboardApp.directive('maPointValues', pointValues);
maDashboardApp.directive('maPointStatistics', pointStatistics);
maDashboardApp.directive('maBandStyle', bandStyle);
maDashboardApp.directive('maSwitchStyle', switchStyle);
maDashboardApp.directive('maTankLevel', tankLevel);
maDashboardApp.directive('maGaugeChart', gaugeChart);
maDashboardApp.directive('maSerialChart', serialChart);
maDashboardApp.directive('maPieChart', pieChart);
maDashboardApp.directive('maClock', clock);
maDashboardApp.directive('maStateChart', stateChart);
maDashboardApp.directive('maCopyBlurred', copyBlurred);
maDashboardApp.directive('maTr', tr);
maDashboardApp.directive('maDatePicker', datePicker);
maDashboardApp.filter('moment', momentFilter);
maDashboardApp.filter('tr', trFilter);

maDashboardApp.run(['$rootScope', function($rootScope) {
    $rootScope.rollupTypes = [
        {type: 'NONE', nonNumeric: true, label: 'None'},
        {type: 'AVERAGE', nonNumeric: false, label: 'Average'},
        {type: 'DELTA', nonNumeric: false, label: 'Delta'},
        {type: 'MINIMUM', nonNumeric: false, label: 'Minimum'},
        {type: 'MAXIMUM', nonNumeric: false, label: 'Maximum'},
        {type: 'ACCUMULATOR', nonNumeric: false, label: 'Accumulator'},
        {type: 'SUM', nonNumeric: false, label: 'Sum'},
        {type: 'FIRST', nonNumeric: true, label: 'First'},
        {type: 'LAST', nonNumeric: true, label: 'Last'},
        {type: 'COUNT', nonNumeric: true, label: 'Count'},
        {type: 'INTEGRAL', nonNumeric: false, label: 'Integral'}
        //{name: 'FFT', nonNumeric: false}
    ];
    
    $rootScope.timePeriodTypes = [
        {type: 'SECONDS', label: 'Seconds'},
        {type: 'MINUTES', label: 'Minutes'},
        {type: 'HOURS', label: 'Hours'},
        {type: 'DAYS', label: 'Days'},
        {type: 'WEEKS', label: 'Weeks'},
        {type: 'MONTHS', label: 'Months'},
        {type: 'YEARS', label: 'Years'}
    ];
    
    $rootScope.chartTypes = [
        {type: 'line', label: 'Line'},
        {type: 'smoothedLine', label: 'Smoothed'},
        {type: 'step', label: 'Step'},
        {type: 'column', label: 'Bar'}
    ];
    
    $rootScope.relativeDateTypes = [
        {type: "", label: 'Now'},
        {type: "moment:'subtract':5:'minutes'", label: '5 minutes ago'},
        {type: "moment:'subtract':15:'minutes'", label: '15 minutes ago'},
        {type: "moment:'subtract':30:'minutes'", label: '30 minutes ago'},
        {type: "moment:'subtract':1:'hours'", label: '1 hour ago'},
        {type: "moment:'subtract':3:'hours'", label: '3 hours ago'},
        {type: "moment:'subtract':5:'hours'", label: '6 hours ago'},
        {type: "moment:'subtract':12:'hours'", label: '12 hours ago'},
        {type: "moment:'startOf':'day'", label: 'Start of day'},
        {type: "moment:'subtract':1:'days'|moment:'startOf':'day'", label: 'Start of previous day'},
        {type: "moment:'subtract':1:'days'", label: '1 day ago'},
        {type: "moment:'startOf':'week'", label: 'Start of week'},
        {type: "moment:'subtract':1:'weeks'|moment:'startOf':'week'", label: 'Start of last week'},
        {type: "moment:'subtract':1:'weeks'", label: '1 week ago'},
        {type: "moment:'subtract':2:'weeks'", label: '2 weeks ago'},
        {type: "moment:'startOf':'month'", label: 'Start of month'},
        {type: "moment:'subtract':1:'months'|moment:'startOf':'month'", label: 'Start of last month'},
        {type: "moment:'subtract':1:'months'", label: '1 month ago'},
        {type: "moment:'subtract':3:'months'", label: '3 months ago'},
        {type: "moment:'subtract':6:'months'", label: '6 months ago'},
        {type: "moment:'startOf':'year'", label: 'Start of year'},
        {type: "moment:'subtract':1:'years'|moment:'startOf':'year'", label: 'Start of last year'},
        {type: "moment:'subtract':1:'years'", label: '1 year ago'}
    ];
}]);

return maDashboardApp;

}); // require
