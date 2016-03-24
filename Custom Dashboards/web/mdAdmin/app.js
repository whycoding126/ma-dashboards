/**
 * Copyright (C) 2016 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * 
 * @author Jared Wiltshire
 */

require(['angular',
         'mango-3.0/maDashboards',
         'mango-3.0/maAppComponents',
         'angular-ui-router',
         'oclazyload',
         'angular-loading-bar',
         'angular-material'],
function(angular, maDashboards, maAppComponents) {
  'use strict';

  var mdAdminApp = angular.module('mdAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'angular-loading-bar',
    'maDashboards',
    'maAppComponents',
    'ngMaterial',
    'ngMessages'
 ]);

  mdAdminApp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.Math = Math;

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      if (error && (error.status === 401 || error.status === 403)) {
        event.preventDefault();
        $state.loginRedirect = toState;
        $state.go('login');
      }
    });
    
  }]);

  mdAdminApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider',
                     '$mdIconProvider',
      function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider, $mdIconProvider) {
    
    $mdIconProvider.fontSet('fa', 'fa');
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
            name:'mdAdminApp',
            files: [
              'directives/sidebar-date-controls/sidebar-date-controls.js'
            ]
          });
        }
      }
    })
    .state('dashboard.home', {
      url: '/home',
      templateUrl: 'views/dashboard/home.html'
    })
    .state('login', {
      templateUrl: 'views/login.html',
      url: '/login',
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load('directives/login/login.js');
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
            name: 'ace',
            files:['../vendor/ace/ace.js']
          }).then(function() {
            return $ocLazyLoad.load({
              name: 'ui-ace',
              files:['../vendor/angular-ui-ace/ui-ace.js']
            });
          }).then(function() {
            return $ocLazyLoad.load(
                ['directives/liveEditor/liveEditor.js',
                 'directives/liveEditor/livePreview.js',
                 'directives/liveEditor/dualPaneEditor.js',
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
    });
  }]);

  angular.element(document).ready(function() {
    angular.bootstrap(document.documentElement, ['mdAdminApp']);
  });

}); // require
