var require = {
    baseUrl : '/modules/dashboards/web/js',
    paths: {
        'mango': '/mango-javascript/v1/',
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
        'jstz': 'jstz-1.0.4.min'
    },
    shim : {
        "jquery-ui/jquery.datetimepicker" : {
            "deps" : ['jquery']
        },
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
