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

var requireJsConfig = {
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
        'jquery.select2': 'select2/js/select2.min'
    },
    shim : {
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
    root.require = requireJsConfig;
}
else if (loader === 'Dojo') {
    var paths = requireJsConfig.paths;
    
    var dojoConfig = this.dojoConfig = {
        baseUrl: requireJsConfig.baseUrl,
        tlmSiblingOfDojo: false,
        // load jquery before anything else so we can put it in noConflict mode
        deps: ['jquery'],
        callback: function($) {
            // remove $ from the global scope, jQuery global is still available
            // $ is defined by DWR and is used in Mango legacy scripts
            $.noConflict();
        },
        packages: [{name: 'dojo', location: '/resources/dojo'},
                   {name: 'dojox', location: '/resources/dojox'},
                   {name: 'dijit', location: '/resources/dijit'},
                   {name: 'dgrid', location: '/resources/dgrid', main: 'OnDemandGrid'},
                   {name: 'xstyle', location: '/resources/xstyle'},
                   {name: 'put-selector', location: '/resources/put-selector', main: 'put'},
                   {name: 'charting', location: '/resources/charting'},
                   {name: 'deltamation', location: '/resources/deltamation'},
                   {name: 'infinite', location: '/resources/infinite'},
                   {name: 'view', location: '/resources/view'},
                   {name: 'mango/mobile', location: '/resources/mango/mobile'}],
        aliases: []
    };
    
    for (var packageName in paths) {
        var path = paths[packageName];
        // turn paths ending with .min and names starting with amcharts or jquery into
        // aliases instead of packages
        if (path.indexOf('.min', path.length - 4) !== -1 ||
                packageName.slice(0, 8) === 'amcharts' ||
                packageName.slice(0, 6) === 'jquery') {
            dojoConfig.aliases.push([
                packageName,
                path
            ]);
        }
        else {
            dojoConfig.packages.push({
                name: packageName,
                location: path
            });
        }
    }
    
    // export dojoConfig to global scope
    root.dojoConfig = dojoConfig;
}

})(this); // execute anonymous function
