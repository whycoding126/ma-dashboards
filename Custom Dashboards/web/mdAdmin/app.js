/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([
    'angular',
    'mango-3.0/maMaterialDashboards',
    'mango-3.0/maAppComponents',
    'require',
    'angular-ui-router',
    'oclazyload',
    'angular-loading-bar'
], function(angular, maMaterialDashboards, maAppComponents, require) {
'use strict';

var mdAdminApp = angular.module('mdAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'angular-loading-bar',
    'maMaterialDashboards',
    'maAppComponents',
    'ngMessages'
]);

mdAdminApp.constant('require', require);
mdAdminApp.constant('CUSTOM_USER_PAGES_XID', 'custom-user-pages');

mdAdminApp.provider('mangoState', ['$stateProvider', function mangoStateProvider($stateProvider) {
    this.addStates = function(pages, parent) {
        angular.forEach(pages, function(page, area) {
            if (page.state) {
                var state = {
                    url: page.url
                }

                if (page.menuTr) {
                    state.menuTr = page.menuTr;
                }
                if (page.menuText) {
                    state.menuText = page.menuText;
                }

                if (parent) {
                    state.parentPage = parent;
                }

                if (page.templateUrl) {
                    state.templateUrl = page.templateUrl;
                } else {
                    state.template = '<div ui-view></div>';
                    state['abstract'] = true;
                }

                if (page.resolve) {
                    state.resolve = page.resolve;
                }
                
                try {
                    $stateProvider.state(page.state, state);
                } catch (error) {
                    // state already exists
                }
            }

            this.addStates(page.children, page);
        }.bind(this));
    }


    // runtime dependencies for the service can be injected here, at the provider.$get() function.
    this.$get = [function() {
        return {
            addState: function(name, state) {
                $stateProvider.state(name, state);
            },
            addStates: this.addStates
        }
    }];
}]);

mdAdminApp.constant('PAGES', [
    {
        state: 'dashboard',
        url: '/dashboard',
        templateUrl: 'views/dashboard/main.html',
        menuHidden: true,
        resolve: {
            auth: ['$rootScope', 'User', function($rootScope, User) {
                $rootScope.user = User.current();
                return $rootScope.user.$promise;
            }],
            loadMyDirectives: ['rQ', '$ocLazyLoad', function(rQ, $ocLazyLoad) {
                return rQ(['./services/Menu',
                           './directives/menu/menu',
                           './directives/menu/menuLink',
                           './directives/menu/menuToggle',
                           './directives/menuEditor/menuEditor'
                ], function(Menu, menu, menuLink, menuToggle, menuEditor) {
                    angular.module('dashboard', [])
                        .factory('Menu', Menu)
                        .directive('maMenu', menu)
                        .directive('menuLink', menuLink)
                        .directive('menuToggle', menuToggle)
                        .directive('menuEditor', menuEditor);
                    $ocLazyLoad.inject('dashboard');
                });
            }],
            dashboardTranslations: ['Translate', function(Translate) {
                return Translate.loadNamespaces(['dashboards', 'common']);
            }]
        }
    },
    {
        state: 'login',
        url: '/login',
        templateUrl: 'views/login.html',
        menuHidden: true,
        menuIcon: 'fa fa-sign-in',
        menuTr: 'header.login',
        resolve: {
            deps: ['rQ', '$ocLazyLoad', function(rQ, $ocLazyLoad) {
                return rQ(['./directives/login/login'], function(login) {
                    angular.module('login', [])
                        .directive('login', login);
                    $ocLazyLoad.inject('login');
                });
            }],
            loginTranslations: ['Translate', function(Translate) {
                return Translate.loadNamespaces('login');
            }]
        }
    },
    {
        state: 'dashboard.home',
        url: '/home',
        templateUrl: 'views/dashboard/home.html',
        menuTr: 'dashboards.v3.dox.home',
        menuIcon: 'fa fa-home'
    },
    {
        state: 'dashboard.apiErrors',
        url: '/api-errors',
        templateUrl: 'views/dashboard/errors.html',
        menuTr: 'dashboards.v3.dox.apiErrors',
        menuHidden: true,
        menuIcon: 'fa fa-exclamation-triangle'
    },
    {
        url: '/examples',
        state: 'dashboard.examples',
        menuHidden: true,
        resolve: {
            loadMyFile: ['rQ', '$ocLazyLoad', function(rQ, $ocLazyLoad) {
                return rQ(['./directives/liveEditor/liveEditor',
                           './directives/liveEditor/livePreview',
                           './directives/liveEditor/dualPaneEditor'],
                function(liveEditor, livePreview, dualPaneEditor) {
                    angular.module('dashboard.examples', ['ui.ace'])
                        .directive('liveEditor', liveEditor)
                        .directive('livePreview', livePreview)
                        .directive('dualPaneEditor', dualPaneEditor);
                    $ocLazyLoad.inject('dashboard.examples');
                });
            }]
        }
    },
    {
        url: '/edit-menu',
        state: 'dashboard.editMenu',
        templateUrl: 'views/dashboard/editMenu.html',
        menuTr: 'dashboards.v3.dox.editMenu',
        menuIcon: 'fa fa-pencil'
    },
    {
        url: '/play-area',
        state: 'dashboard.examples.playArea',
        templateUrl: 'views/examples/playArea.html',
        menuTr: 'dashboards.v3.dox.playArea',
        menuIcon: 'fa fa-magic'
    },
    {
        state: 'dashboard.examples.playAreaBig',
        templateUrl: 'views/examples/playAreaBig.html',
        url: '/play-area-big',
        menuTr: 'dashboards.v3.dox.playArea',
        menuHidden: true,
        menuIcon: 'fa fa-magic'
    },
    {
        state: 'dashboard.examples.basics',
        url: '/basics',
        menuTr: 'dashboards.v3.dox.basics',
        menuIcon: 'fa fa-info-circle',
        children: [
            {
                state: 'dashboard.examples.basics.createDashboard',
                templateUrl: 'views/examples/createDashboard.html',
                url: '/create-dashboard',
                menuTr: 'dashboards.v3.dox.createDashboard'
            },
            {
                state: 'dashboard.examples.basics.angular',
                templateUrl: 'views/examples/angular.html',
                url: '/angular',
                menuTr: 'dashboards.v3.dox.angular'
            },
            {
                state: 'dashboard.examples.basics.pointList',
                templateUrl: 'views/examples/pointList.html',
                url: '/point-list',
                menuTr: 'dashboards.v3.dox.pointList'
            },
            {
                state: 'dashboard.examples.basics.getPointByXid',
                templateUrl: 'views/examples/getPointByXid.html',
                url: '/get-point-by-xid',
                menuTr: 'dashboards.v3.dox.getPointByXid'
            },
            {
                state: 'dashboard.examples.basics.dataSourceAndDeviceList',
                templateUrl: 'views/examples/dataSourceAndDeviceList.html',
                url: '/data-source-and-device-list',
                menuTr: 'dashboards.v3.dox.dataSourceAndDeviceList'
            },
            {
                state: 'dashboard.examples.basics.liveValues',
                templateUrl: 'views/examples/liveValues.html',
                url: '/live-values',
                menuTr: 'dashboards.v3.dox.liveValues'
            },
            {
                state: 'dashboard.examples.basics.filters',
                templateUrl: 'views/examples/filters.html',
                url: '/filters',
                menuTr: 'dashboards.v3.dox.filters'
            },
            {
                state: 'dashboard.examples.basics.datePresets',
                templateUrl: 'views/examples/datePresets.html',
                url: '/date-presets',
                menuTr: 'dashboards.v3.dox.datePresets'
            },
            {
                state: 'dashboard.examples.basics.styleViaValue',
                templateUrl: 'views/examples/styleViaValue.html',
                url: '/style-via-value',
                menuTr: 'dashboards.v3.dox.styleViaValue'
            },
            {
                state: 'dashboard.examples.basics.pointValues',
                templateUrl: 'views/examples/pointValues.html',
                url: '/point-values',
                menuTr: 'dashboards.v3.dox.pointValues'
            },
            {
                state: 'dashboard.examples.basics.latestPointValues',
                templateUrl: 'views/examples/latestPointValues.html',
                url: '/latest-point-values',
                menuTr: 'dashboards.v3.dox.latestPointValues'
            },
            {
                state: 'dashboard.examples.basics.clocksAndTimezones',
                templateUrl: 'views/examples/clocksAndTimezones.html',
                url: '/clocks-and-timezones',
                menuTr: 'dashboards.v3.dox.clocksAndTimezones'
            }
        ]
    },
    {
        state: 'dashboard.examples.templates',
        url: '/templates',
        menuTr: 'dashboards.v3.dox.templates',
        menuIcon: 'fa fa-file-o',
        children: [
            {
                state: 'dashboard.examples.templates.angularMaterial',
                templateUrl: 'views/examples/angularMaterial.html',
                url: '/angular-material',
                menuText: 'Angular Material'
            },
            {
                state: 'dashboard.examples.templates.bootstrap',
                templateUrl: 'views/examples/bootstrap.html',
                url: '/bootstrap',
                menuText: 'Bootstrap 3'
            },
            {
                state: 'dashboard.examples.templates.autoLogin',
                templateUrl: 'views/examples/autoLogin.html',
                url: '/auto-login',
                menuTr: 'dashboards.v3.dox.autoLogin'
            },
            {
                state: 'dashboard.examples.templates.extendApp',
                templateUrl: 'views/examples/extendApp.html',
                url: '/extend-app',
                menuTr: 'dashboards.v3.dox.extendApp'
            },
            {
                state: 'dashboard.examples.templates.loginPage',
                templateUrl: 'views/examples/loginPageTemplate.html',
                url: '/login-page',
                menuTr: 'dashboards.v3.dox.loginPageTemplate'
            },
            {
                state: 'dashboard.examples.templates.adminTemplate',
                templateUrl: 'views/examples/adminTemplate.html',
                url: '/admin-template',
                menuTr: 'dashboards.v3.dox.adminTemplate'
            },
            {
                state: 'dashboard.examples.templates.adaptiveLayouts',
                templateUrl: 'views/examples/adaptiveLayouts.html',
                url: '/adaptive-layouts',
                menuText: 'Adaptive Layouts'
            }
        ]
    },
    {
        state: 'dashboard.examples.utilities',
        url: '/utilities',
        menuTr: 'dashboards.v3.dox.utilities',
        menuIcon: 'fa fa-wrench',
        children: [
            {
                state: 'dashboard.examples.utilities.translation',
                templateUrl: 'views/examples/translation.html',
                url: '/translation',
                menuTr: 'dashboards.v3.dox.translation'
            },
            {
                state: 'dashboard.examples.utilities.jsonStore',
                templateUrl: 'views/examples/jsonStore.html',
                url: '/json-store',
                menuTr: 'dashboards.v3.dox.jsonStore'
            },
            {
                state: 'dashboard.examples.utilities.watchdog',
                templateUrl: 'views/examples/watchdog.html',
                url: '/watchdog',
                menuTr: 'dashboards.v3.dox.watchdog'
            }
        ]
    },
    {
        state: 'dashboard.examples.singleValueDisplays',
        url: '/single-value-displays',
        menuTr: 'dashboards.v3.dox.singleValueDisplays',
        menuIcon: 'fa fa-tachometer',
        children: [
            {
                state: 'dashboard.examples.singleValueDisplays.gauges',
                templateUrl: 'views/examples/gauges.html',
                url: '/gauges',
                menuTr: 'dashboards.v3.dox.gauges'
            },
            {
                state: 'dashboard.examples.singleValueDisplays.switchImage',
                templateUrl: 'views/examples/switchImage.html',
                url: '/switch-image',
                menuTr: 'dashboards.v3.dox.switchImage'
            },
            {
                state: 'dashboard.examples.singleValueDisplays.bars',
                templateUrl: 'views/examples/bars.html',
                url: '/bars',
                menuTr: 'dashboards.v3.dox.bars'
            },
            {
                state: 'dashboard.examples.singleValueDisplays.tanks',
                templateUrl: 'views/examples/tanks.html',
                url: '/tanks',
                menuTr: 'dashboards.v3.dox.tanks'
            }
        ]
    },
    {
        state: 'dashboard.examples.charts',
        url: '/charts',
        menuTr: 'dashboards.v3.dox.charts',
        menuIcon: 'fa fa-area-chart',
        children: [
            {
                state: 'dashboard.examples.charts.lineChart',
                templateUrl: 'views/examples/lineChart.html',
                url: '/line-chart',
                menuTr: 'dashboards.v3.dox.lineChart'
            },
            {
                state: 'dashboard.examples.charts.barChart',
                templateUrl: 'views/examples/barChart.html',
                url: '/bar-chart',
                menuTr: 'dashboards.v3.dox.barChart'
            },
            {
                state: 'dashboard.examples.charts.advancedChart',
                templateUrl: 'views/examples/advancedChart.html',
                url: '/advanced-chart',
                menuTr: 'dashboards.v3.dox.advancedChart'
            },
            {
                state: 'dashboard.examples.charts.stateChart',
                templateUrl: 'views/examples/stateChart.html',
                url: '/state-chart',
                menuTr: 'dashboards.v3.dox.stateChart'
            },
            {
                state: 'dashboard.examples.charts.liveUpdatingChart',
                templateUrl: 'views/examples/liveUpdatingChart.html',
                url: '/live-updating-chart',
                menuTr: 'dashboards.v3.dox.liveUpdatingChart'
            },
            {
                state: 'dashboard.examples.charts.pieChart',
                templateUrl: 'views/examples/pieChart.html',
                url: '/pie-chart',
                menuTr: 'dashboards.v3.dox.pieChart'
            },
            {
                state: 'dashboard.examples.charts.dailyComparison',
                templateUrl: 'views/examples/dailyComparisonChart.html',
                url: '/daily-comparison',
                menuTr: 'dashboards.v3.dox.dailyComparisonChart'
            }
        ]
    },
    {
        state: 'dashboard.examples.statistics',
        url: '/statistics',
        menuTr: 'dashboards.v3.dox.statistics',
        menuIcon: 'fa fa-table',
        children: [
            {
                state: 'dashboard.examples.statistics.getStatistics',
                templateUrl: 'views/examples/getStatistics.html',
                url: '/get-statistics',
                menuTr: 'dashboards.v3.dox.getStatistics'
            },
            {
                state: 'dashboard.examples.statistics.statisticsTable',
                templateUrl: 'views/examples/statisticsTable.html',
                url: '/statistics-table',
                menuTr: 'dashboards.v3.dox.statisticsTable'
            },
            {
                state: 'dashboard.examples.statistics.statePieChart',
                templateUrl: 'views/examples/statePieChart.html',
                url: '/state-pie-chart',
                menuTr: 'dashboards.v3.dox.statePieChart'
            }
        ]
    },
    {
        state: 'dashboard.examples.pointArrays',
        url: '/point-arrays',
        menuTr: 'dashboards.v3.dox.pointArrayTemplating',
        menuIcon: 'fa fa-list',
        children: [
            {
                state: 'dashboard.examples.pointArrays.buildPointArray',
                templateUrl: 'views/examples/buildPointArray.html',
                url: '/build-point-array',
                menuTr: 'dashboards.v3.dox.buildPointArray'
            },
            {
                state: 'dashboard.examples.pointArrays.pointArrayTable',
                templateUrl: 'views/examples/pointArrayTable.html',
                url: '/point-array-table',
                menuTr: 'dashboards.v3.dox.pointArrayTable'
            },
            {
                state: 'dashboard.examples.pointArrays.pointArrayLineChart',
                templateUrl: 'views/examples/pointArrayLineChart.html',
                url: '/point-array-line-chart',
                menuTr: 'dashboards.v3.dox.pointArrayLineChart'
            },
            {
                state: 'dashboard.examples.pointArrays.templating',
                templateUrl: 'views/examples/templating.html',
                url: '/templating',
                menuTr: 'dashboards.v3.dox.templating'
            },
            {
                state: 'dashboard.examples.pointArrays.dataPointTable',
                templateUrl: 'views/examples/dataPointTable.html',
                url: '/data-point-table',
                menuTr: 'dashboards.v3.dox.dataPointTable'
            }
        ]
    },
    {
        state: 'dashboard.examples.pointHierarchy',
        url: '/point-hierarchy',
        menuTr: 'dashboards.v3.dox.pointHierarchy',
        menuIcon: 'fa fa-sitemap',
        children: [
            {
                state: 'dashboard.examples.pointHierarchy.displayTree',
                templateUrl: 'views/examples/displayTree.html',
                url: '/display-tree',
                menuTr: 'dashboards.v3.dox.displayTree'
            },
            {
                state: 'dashboard.examples.pointHierarchy.pointHierarchyLineChart',
                templateUrl: 'views/examples/pointHierarchyLineChart.html',
                url: '/line-chart',
                menuTr: 'dashboards.v3.dox.pointHierarchyLineChart'
            }
        ]
    },
    {
        state: 'dashboard.examples.settingPointValues',
        url: '/setting-point-values',
        menuTr: 'dashboards.v3.dox.settingPoint',
        menuIcon: 'fa fa-pencil-square-o',
        children: [
            {
                state: 'dashboard.examples.settingPointValues.setPoint',
                templateUrl: 'views/examples/setPoint.html',
                url: '/set-point',
                menuTr: 'dashboards.v3.dox.settingPoint'
            },
            {
                state: 'dashboard.examples.settingPointValues.toggle',
                templateUrl: 'views/examples/toggle.html',
                url: '/toggle',
                menuTr: 'dashboards.v3.dox.toggle'
            },
            {
                state: 'dashboard.examples.settingPointValues.sliders',
                templateUrl: 'views/examples/sliders.html',
                url: '/sliders',
                menuTr: 'dashboards.v3.dox.sliders'
            },
            {
                state: 'dashboard.examples.settingPointValues.multistateRadio',
                templateUrl: 'views/examples/multistateRadio.html',
                url: '/multistate-radio-buttons',
                menuTr: 'dashboards.v3.dox.multistateRadio'
            }
        ]
    }
]);

mdAdminApp.config([
    'PAGES',
    '$stateProvider',
    '$urlRouterProvider',
    '$ocLazyLoadProvider',
    '$httpProvider',
    '$mdThemingProvider',
    '$injector',
    '$compileProvider',
    'mangoStateProvider',
function(PAGES, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider, $mdThemingProvider, $injector, $compileProvider, mangoStateProvider) {

    $compileProvider.debugInfoEnabled(false);

    $mdThemingProvider.definePalette('mango-orange', {
        '50': '#ffffff',
        '100': '#ffdfbd',
        '200': '#ffc485',
        '300': '#ffa23d',
        '400': '#ff941f',
        '500': '#ff8500',
        '600': '#e07500',
        '700': '#c26500',
        '800': '#a35500',
        '900': '#854500',
        'A100': '#ffba6f',
        'A200': '#ff921c',
        'A400': '#ff8500',
        'A700': '#da7200',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 300 A100'
    });

    $mdThemingProvider.definePalette('mango-blue', {
        '50': '#f9fdff',
        '100': '#ade8ff',
        '200': '#75d9ff',
        '300': '#2dc5ff',
        '400': '#0fbdff',
        '500': '#00adef',
        '600': '#0097d0',
        '700': '#0081b2',
        '800': '#006b93',
        '900': '#005475',
        'A100': '#6dcaed',
        'A200': '#24bbf5',
        'A400': '#00adef',
        'A700': '#006389',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 300 A100'
    });

    $mdThemingProvider
        .theme('default')
        .primaryPalette('mango-blue', {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': '100'
        })
        .accentPalette('mango-orange', {
            'default': 'A400',
            'hue-1': 'A100',
            'hue-2': 'A200',
            'hue-3': 'A700'
        });

    $mdThemingProvider
        .theme('inverse')
        .primaryPalette('mango-orange', {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': '100'
        })
        .accentPalette('mango-blue', {
            'default': 'A400',
            'hue-1': 'A100',
            'hue-2': 'A200',
            'hue-3': 'A700'
        });

    $httpProvider.interceptors.push('errorInterceptor');

    if ($injector.has('$mdpTimePickerProvider')) {
        var $mdpTimePickerProvider = $injector.get('$mdpTimePickerProvider');
        /*
        $mdpTimePickerProvider.setOKButtonLabel();
        $mdpTimePickerProvider.setCancelButtonLabel();
        */
    }

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');
    mangoStateProvider.addStates(PAGES);

}]);

mdAdminApp.run([
    'PAGES',
    '$rootScope',
    '$state',
    '$timeout',
    '$mdSidenav',
    '$mdColors',
    '$MD_THEME_CSS',
    'cssInjector',
function(PAGES, $rootScope, $state, $timeout, $mdSidenav, $mdColors, $MD_THEME_CSS, cssInjector) {
    $rootScope.pages = PAGES;
    $rootScope.Math = Math;

    // inserts a style tag to style <a> tags with accent color
    if ($MD_THEME_CSS) {
        var acc = $mdColors.getThemeColor('accent-500-1.0');
        var accT = $mdColors.getThemeColor('accent-500-0.2');
        var accD = $mdColors.getThemeColor('accent-700-1.0');
        var styleContent =
            'a:not(.md-button) {color: ' + acc +'; border-bottom-color: ' + accT + ';}\n' +
            'a:not(.md-button):hover, a:not(.md-button):focus {color: ' + accD + '; border-bottom-color: ' + accD + ';}\n';

        cssInjector.injectStyle(styleContent, null, '[md-theme-style]');
    }

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        if (error && (error.status === 401 || error.status === 403)) {
            event.preventDefault();
            $state.loginRedirect = toState;
            $state.go('login');
        }
    });

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        var crumbs = [];
        var state = toState;
        do {
            if (state.menuTr) {
                crumbs.unshift({maTr: state.menuTr});
            } else if (state.menuText) {
                crumbs.unshift({text: state.menuText});
            }
        } while (state = state.parentPage);
        $rootScope.crumbs = crumbs;
    });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if ($state.includes('dashboard')) {
            $rootScope.closeMenu();
        }
    });

    $rootScope.closeMenu = function() {
        $mdSidenav('left').close();
    }

    $rootScope.openMenu = function() {
        angular.element('#menu-button').blur();
        $mdSidenav('left').open();
    }

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.documentElement, ['mdAdminApp']);
});

}); // define
