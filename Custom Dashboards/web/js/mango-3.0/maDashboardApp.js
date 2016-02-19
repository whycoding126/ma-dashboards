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
        './filters/momentFilter',
        './filters/trFilter',
        'angular',
        'angular-resource'
], function(Point, PointEventManager, translate, pointList, pointValue, pointValues, pointStatistics,
        bandStyle, switchStyle, tankLevel, gaugeChart, serialChart, pieChart, clock, stateChart, copyBlurred, tr, momentFilter, trFilter, angular) {
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
}]);

return maDashboardApp;

}); // require
