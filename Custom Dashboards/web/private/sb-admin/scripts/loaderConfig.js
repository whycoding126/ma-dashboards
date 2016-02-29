var bower = '/modules/dashboards/web/private/sb-admin/bower_components';

require.config({
	paths: {
		'angular-route': bower + '/angular-route/angular-route.min',
		'angular-ui-router': bower + '/angular-ui-router/release/angular-ui-router.min',
		'json3': bower + '/json3/lib/json3.min',
		'oclazyload': bower + '/oclazyload/dist/ocLazyLoad.min',
		'angular-loading-bar': bower + '/angular-loading-bar/build/loading-bar.min',
		'angular-bootstrap': bower + '/angular-bootstrap/ui-bootstrap-tpls.min',
		'metisMenu': bower + '/metisMenu/dist/metisMenu.min',
		'ace': bower + '/ace-builds/src-min-noconflict/ace',
		'angular-ui-ace': bower + '/angular-ui-ace/ui-ace.min'
	},
	shim: {
		'angular-route': {
	        deps: ['angular']
	    },
	    'angular-ui-router': {
	        deps: ['angular', 'angular-route']
	    },
	    'oclazyload': {
	        deps: ['angular-ui-router']
	    },
	    'angular-loading-bar': {
	        deps: ['angular']
	    },
	    'angular-bootstrap': {
	        deps: ['angular', 'bootstrap']
	    },
	    'metisMenu': {
	    	deps: ['jquery']
	    },
	    'angular-ui-ace': {
	        deps: ['angular', 'ace']
	    }
	}
});
