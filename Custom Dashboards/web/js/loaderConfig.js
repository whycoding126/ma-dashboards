(function(root) {
'use strict';

var module = '/modules/dashboards/web';
var vendor = module + '/vendor';

require.config({
    paths : {
        'dashboards' : module,
        'angular-route' : vendor + '/angular-route/angular-route',
        'angular-ui-router' : vendor + '/angular-ui-router/angular-ui-router',
        'json3' : vendor + '/json3/json3',
        'oclazyload' : vendor + '/oclazyload/ocLazyLoad',
        'angular-loading-bar' : vendor + '/angular-loading-bar/loading-bar',
        'angular-bootstrap' : vendor + '/angular-bootstrap/ui-bootstrap-tpls',
        'metisMenu' : vendor + '/metisMenu/metisMenu',
        'ace' : vendor + '/ace/ace',
        'angular-ui-ace' : vendor + '/angular-ui-ace/ui-ace',
        'angular-material' : vendor + '/angular-material/angular-material',
        'angular-animate' : vendor + '/angular-animate/angular-animate',
        'angular-messages' : vendor + '/angular-messages/angular-messages',
        'angular-aria' : vendor + '/angular-aria/angular-aria'
    },
    shim : {
        'angular-route' : {
            deps : ['angular']
        },
        'angular-ui-router' : {
            deps : ['angular']
        },
        'oclazyload' : {
            deps : ['angular-ui-router']
        },
        'angular-loading-bar' : {
            deps : ['angular']
        },
        'angular-bootstrap' : {
            deps : ['angular', 'bootstrap']
        },
        'metisMenu' : {
            deps : ['jquery']
        },
        'angular-ui-ace' : {
            deps : ['angular', 'ace']
        },
        'angular-material' : {
            deps : ['angular', 'angular-animate', 'angular-aria', 'angular-messages']
        },
        'angular-animate' : {
            deps : ['angular']
        },
        'angular-messages' : {
            deps : ['angular']
        },
        'angular-aria' : {
            deps : ['angular']
        }
    }
});

})(this);
