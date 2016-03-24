require(['angular', 'mango-3.0/maDashboards', 'jquery', 'scripts/services/errorInterceptor.js',
         'bootstrap', 'angular-ui-router', 'oclazyload', 'angular-loading-bar', 'angular-bootstrap',
         'metisMenu'],
         function(angular, maDashboards, $, errorInterceptorFactory) {

'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular.module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'maDashboards'
  ])
  .factory('errorInterceptor', errorInterceptorFactory)
  .run(['$rootScope', '$state', function($rootScope, $state) {
	  $rootScope.Math = Math;
	  
	  $rootScope.errors = [];
	  $rootScope.clearErrors = function() {
		  $rootScope.errors = [];
	  }

	  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
		  if (error && (error.status === 401 || error.status === 403)) {
			  event.preventDefault();
			  $state.loginRedirect = toState;
			  $state.go('login');
		  }
	  });
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider',
      function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {

	$httpProvider.interceptors.push('errorInterceptor');
	  
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
        	auth: ['$rootScope', 'User', function($rootScope, User) {
        		$rootScope.user = User.current();
        		return $rootScope.user.$promise;
        	}],
            loadMyDirectives: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                    'scripts/directives/sidebar/sidebar-date-controls/sidebar-date-controls.js'
                    ]
                }).then(function() {
                	return $ocLazyLoad.load({
	                   name:'toggle-switch',
	                   files:["../vendor/angular-toggle-switch/angular-toggle-switch.js",
	                          "../vendor/angular-toggle-switch/angular-toggle-switch.css"
	                      ]
	                });
                }).then(function() {
                	return $ocLazyLoad.load({
	                  name:'ngAnimate',
	                  files:['../vendor/angular-animate/angular-animate.js']
	                });
            	}).then(function() {
	                return $ocLazyLoad.load({
	                  name:'ngCookies',
	                  files:['../vendor/angular-cookies/angular-cookies.js']
	                });
            	}).then(function() {
                	return $ocLazyLoad.load({
	                  name:'ngResource',
	                  files:['../vendor/angular-resource/angular-resource.js']
                	});
            	}).then(function() {
                	return $ocLazyLoad.load({
	                  name:'ngSanitize',
	                  files:['../vendor/angular-sanitize/angular-sanitize.js']
	                });
            	}).then(function() {
                	return $ocLazyLoad.load({
	                  name:'ngTouch',
	                  files:['../vendor/angular-touch/angular-touch.js']
	                });
                });
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
    .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
    .state('login', {
        templateUrl: 'views/pages/login.html',
        url: '/login',
        resolve: {
        	deps: ['$ocLazyLoad', function($ocLazyLoad) {
        		return $ocLazyLoad.load('scripts/directives/login/login.js');
        	}]
        }
    })
    .state('dashboard.examples', {
    	'abstract': true,
    	url: '/examples',
    	template: '<ui-view/>',
    	resolve: {
            loadMyFile: ['$ocLazyLoad', function($ocLazyLoad) {
            	return $ocLazyLoad.load({
            		name: 'ace.js',
            		files:['../vendor/ace/ace.js']
            	}).then(function() {
            		return $ocLazyLoad.load({
                		name: 'ui.ace',
                		files:['../vendor/angular-ui-ace/ui-ace.js']
                	});
            	}).then(function() {
            		return $ocLazyLoad.load(
            			['scripts/directives/liveEditor/liveEditor.js',
            			 'scripts/directives/liveEditor/livePreview.js',
            			 'scripts/directives/liveEditor/dualPaneEditor.js',
            			 'styles/examples.css']
                	);
            	});
            }]
        }
    })
    .state('dashboard.examples.playArea', {
        templateUrl:'views/examples/playArea.html',
        url:'/play-area'
    })
    .state('dashboard.examples.playAreaBig', {
        templateUrl:'views/examples/playAreaBig.html',
        url:'/play-area-big'
    })
    .state('dashboard.examples.templating', {
        templateUrl:'views/examples/templating.html',
        url:'/templating'
    })
    .state('dashboard.examples.angular', {
        templateUrl:'views/examples/angular.html',
        url:'/angular'
    })
    .state('dashboard.examples.pageTemplate', {
        templateUrl:'views/examples/pageTemplate.html',
        url:'/page-template'
    })
    .state('dashboard.examples.pointList', {
        templateUrl:'views/examples/pointList.html',
        url:'/point-list'
    })
    .state('dashboard.examples.liveValues', {
        templateUrl:'views/examples/liveValues.html',
        url:'/live-values'
    })
    .state('dashboard.examples.filters', {
        templateUrl:'views/examples/filters.html',
        url:'/filters'
    })
    .state('dashboard.examples.datePresets', {
        templateUrl:'views/examples/datePresets.html',
        url:'/date-presets'
    })
    .state('dashboard.examples.pointValues', {
        templateUrl:'views/examples/pointValues.html',
        url:'/point-values'
    })
    .state('dashboard.examples.getPointByXid', {
        templateUrl:'views/examples/getPointByXid.html',
        url:'/get-point-by-xid'
    })
    .state('dashboard.examples.latestPointValues', {
        templateUrl:'views/examples/latestPointValues.html',
        url:'/latest-point-values'
    })
    .state('dashboard.examples.watchdog', {
        templateUrl:'views/examples/watchdog.html',
        url:'/watchdog'
    })
    .state('dashboard.examples.switchImage', {
        templateUrl:'views/examples/switchImage.html',
        url:'/switch-image'
    })
    .state('dashboard.examples.bars', {
        templateUrl:'views/examples/bars.html',
        url:'/bars'
    })
    .state('dashboard.examples.gauges', {
        templateUrl:'views/examples/gauges.html',
        url:'/gauges'
    })
    .state('dashboard.examples.tanks', {
        templateUrl:'views/examples/tanks.html',
        url:'/tanks'
    })
    .state('dashboard.examples.translation', {
        templateUrl:'views/examples/translation.html',
        url:'/translation'
    })
    .state('dashboard.examples.lineChart',{
        templateUrl:'views/examples/lineChart.html',
        url:'/line-chart'
    })
    .state('dashboard.examples.barChart',{
        templateUrl:'views/examples/barChart.html',
        url:'/bar-chart'
    })
    .state('dashboard.examples.advancedChart',{
        templateUrl:'views/examples/advancedChart.html',
        url:'/advanced-chart'
    })
    .state('dashboard.examples.stateChart',{
        templateUrl:'views/examples/stateChart.html',
        url:'/state-chart'
    })
    .state('dashboard.examples.pointArrayLineChart',{
        templateUrl:'views/examples/pointArrayLineChart.html',
        url:'/point-array-line-chart'
    })
    .state('dashboard.examples.pointArrayTable',{
        templateUrl:'views/examples/pointArrayTable.html',
        url:'/point-array-table'
    })
    .state('dashboard.examples.getStatistics',{
        templateUrl:'views/examples/getStatistics.html',
        url:'/get-statistics'
    })
    .state('dashboard.examples.statePieChart',{
        templateUrl:'views/examples/statePieChart.html',
        url:'/state-pie-chart'
    })
    .state('dashboard.examples.statisticsTable',{
        templateUrl:'views/examples/statisticsTable.html',
        url:'/statistics-table'
    })
    .state('dashboard.examples.setPoint', {
        templateUrl:'views/examples/setPoint.html',
        url:'/set-point'
    })
    .state('dashboard.examples.toggle', {
        templateUrl:'views/examples/toggle.html',
        url:'/toggle'
    })
    .state('dashboard.examples.jsonStore', {
        templateUrl:'views/examples/jsonStore.html',
        url:'/json-store'
    })
    .state('dashboard.thermal', {
    	'abstract': true,
    	url: '/thermal',
    	template: '<ui-view/>'
    })
    .state('dashboard.thermal.mdf', {
        templateUrl:'views/thermal/mdf.html',
        url:'/mdf'
    })
    .state('dashboard.electric', {
    	'abstract': true,
    	url: '/electric',
    	template: '<ui-view/>'
    })
    .state('dashboard.electric.total', {
        templateUrl:'views/electric/total.html',
        url:'/total'
    })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   });
}]);

angular.element(document).ready(function() {
	angular.bootstrap(document.documentElement, ['sbAdminApp']);
});

});