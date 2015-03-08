/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

(function(root){

var loader;

var scriptTags = document.getElementsByTagName('script');
for (var i = 0; i < scriptTags.length; i++) {
    var script = scriptTags[i];
    if (script.getAttribute('src') === '/modules/dashboards/web/js/config.js') {
        loader = script.getAttribute('data-loader') || 'RequireJS';
        break;
    }
}

var config = {
    baseUrl : '/modules/dashboards/web/js',
    paths: {
        'mango': '/mango-javascript/v1',
        'jquery': 'jquery/jquery-1.11.2.min',
        'amcharts'          : 'amcharts/amcharts',
        'amcharts.funnel'   : 'amcharts/funnel',
        'amcharts.gauge'    : 'amcharts/gauge',
        'amcharts.pie'      : 'amcharts/pie',
        'amcharts.radar'    : 'amcharts/radar',
        'amcharts.serial'   : 'amcharts/serial',
        'amcharts.xy'       : 'amcharts/xy',
        'bootstrap': 'bootstrap/js/bootstrap.min',
        'moment': 'moment-with-locales.min',
        'moment-timezone': 'moment-timezone-with-data.min',
        'es5-shim': 'es5-shim.min',
        'jstz': 'jstz-1.0.4.min',
        'jquery.mousewheel': 'jquery.mousewheel.min',
        // for whatever reason this works but the AMD version doesn't
        'jquery.select2': 'select2/js/select2.min',
        'dojo': '/resources/dojo',
        'dojox': '/resources/dojox',
        'dijit': '/resources/dijit',
        'dgrid': '/resources/dgrid',
        'xstyle': '/resources/xstyle',
        'put-selector': '/resources/put-selector',
        'charting': '/resources/charting',
        'deltamation': '/resources/deltamation',
        'infinite': '/resources/infinite',
        'view': '/resources/view',
        'mango/mobile': '/resources/mango/mobile'
    },
    shim: {
        "bootstrap" : {
            "deps" : ['jquery']
        },
        'amcharts.funnel'   : {
            deps: ['amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts.gauge'    : {
            deps: ['amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts.pie'      : {
            deps: ['amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts.radar'    : {
            deps: ['amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts.serial'   : {
            deps: ['amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts.xy'       : {
            deps: ['amcharts'],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        }
    }
};

if (loader === 'RequireJS') {
    // export require to global scope
    root.require = config;
}
else if (loader === 'Dojo') {
    config.tlmSiblingOfDojo = false;
    // load jquery before anything else so we can put it in noConflict mode
    config.deps = ['jquery'];
    config.callback = function($) {
        // remove $ from the global scope, jQuery global is still available
        // $ is defined by DWR and is used in Mango legacy scripts
        $.noConflict();
    };
    
    // export dojoConfig to global scope
    root.dojoConfig = config;
}

})(this); // execute anonymous function
