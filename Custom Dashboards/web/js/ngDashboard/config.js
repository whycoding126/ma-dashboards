/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

(function(){
'use strict';

var dashboardsModule = '/modules/dashboards/web/js';
var bower = '/modules/dashboards/web/bower_components';

require.config({
    paths: {
        'dashboards': dashboardsModule,
        'ngDashboard': dashboardsModule + '/ngDashboard',
        'angular': bower + '/angular/angular',
        'angular-resource': bower + '/angular-resource/angular-resource',
        'moment': bower + '/moment/min/moment-with-locales.min',
        'moment-timezone': bower + '/moment-timezone/builds/moment-timezone-with-data.min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-resource': {
            deps: ['angular']
        },
        'amcharts/gauge': {
            deps: ['amcharts/amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts/serial': {
            deps: ['amcharts/amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts/pie': {
            deps: ['amcharts/amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts/gantt': {
            deps: ['amcharts/serial'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        }
    }
});

})();