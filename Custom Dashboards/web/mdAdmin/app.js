/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([
    'angular',
    'mango-3.3/maMaterialDashboards',
    'mango-3.3/maAppComponents',
    'require',
    './services/Page',
    './services/DateBar',
    './directives/pageView/pageView',
    './directives/liveEditor/livePreview',
    'angular-ui-router',
    'angular-ui-sortable',
    'oclazyload',
    'angular-loading-bar',
    './views/docs/docs-setup'
], function(angular, maMaterialDashboards, maAppComponents, require, Page, DateBar, pageView, livePreview) {
'use strict';

var mdAdminApp = angular.module('mdAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.sortable',
    'angular-loading-bar',
    'maMaterialDashboards',
    'maAppComponents',
    'ngMessages'
]);

mdAdminApp.factory('Page', Page)
    .factory('DateBar', DateBar)
    .directive('pageView', pageView)
    .directive('livePreview', livePreview)
    .constant('require', require)
    .constant('CUSTOM_USER_MENU_XID', 'custom-user-menu')
    .constant('CUSTOM_USER_PAGES_XID', 'custom-user-pages')
    .constant('DASHBOARDS_NG_DOCS', NG_DOCS);

mdAdminApp.provider('mangoState', ['$stateProvider', function mangoStateProvider($stateProvider) {
    this.addStates = function(menuItems, parent) {
        angular.forEach(menuItems, function(menuItem, parent) {
            if (menuItem.name || menuItem.state) {
                //menuItem.parent = parent;
                if (menuItem.linkToPage) {
                    delete menuItem.templateUrl;
                    menuItem.template = '<page-view xid="' + menuItem.pageXid + '"></page-view>';
                }
                if (menuItem.templateUrl) {
                    delete menuItem.template;
                }
                if (!menuItem.templateUrl && !menuItem.template && !menuItem.views) {
                    menuItem.template = '<div ui-view></div>';
                    menuItem['abstract'] = true;
                }
                if (!menuItem.name) {
                    menuItem.name = menuItem.state;
                }

                try {
                    $stateProvider.state(menuItem);
                } catch (error) {
                    // state already exists
                }
            }

            this.addStates(menuItem.children, menuItem);
        }.bind(this));
    };

    // runtime dependencies for the service can be injected here, at the provider.$get() function.
    this.$get = [function() {
        return {
            addState: function(name, state) {
                $stateProvider.state(name, state);
            },
            addStates: this.addStates
        }
    }.bind(this)];
}]);

mdAdminApp.constant('MENU_ITEMS', [
    {
        name: 'dashboard',
        templateUrl: 'views/dashboard/main.html',
        abstract: true,
        menuHidden: true,
        resolve: {
            auth: ['Translate', 'MD_ADMIN_SETTINGS', function(Translate, MD_ADMIN_SETTINGS) {
                if (!MD_ADMIN_SETTINGS.user) {
                    throw 'No user';
                }
                return Translate.loadNamespaces(['dashboards', 'common']);
            }],
            loadMyDirectives: ['rQ', '$ocLazyLoad', function(rQ, $ocLazyLoad) {
                return rQ(['./services/Menu',
                           './services/MenuEditor',
                           './components/menu/jsonStoreMenu',
                           './components/menu/dashboardMenu',
                           './components/menu/menuLink',
                           './components/menu/menuToggle',
                           './directives/menuEditor/menuEditor',
                           './directives/pageEditor/pageEditor',
                           './directives/liveEditor/liveEditor',
                           './directives/liveEditor/dualPaneEditor',
                           './directives/iframeView/iframeView',
                           './directives/stateParams/stateParams',
                           './components/autoLoginSettings/autoLoginSettings',
                           './components/activeEventIcons/activeEventIcons',
                           './components/dateBar/dateBar'
                ], function(Menu, MenuEditor, jsonStoreMenu, dashboardMenu, menuLink, menuToggle,
                        menuEditor, pageEditor, liveEditor, dualPaneEditor, iframeView, stateParams, autoLoginSettings, activeEventIcons, dateBar) {
                    angular.module('dashboard', ['ui.ace'])
                        .factory('Menu', Menu)
                        .factory('MenuEditor', MenuEditor)
                        .factory('DateBar', DateBar)
                        .directive('menuEditor', menuEditor)
                        .directive('pageEditor', pageEditor)
                        .directive('liveEditor', liveEditor)
                        .directive('dualPaneEditor', dualPaneEditor)
                        .directive('iframeView', iframeView)
                        .directive('stateParams', stateParams)
                        .component('jsonStoreMenu', jsonStoreMenu)
                        .component('dashboardMenu', dashboardMenu)
                        .component('menuLink', menuLink)
                        .component('menuToggle', menuToggle)
                        .component('autoLoginSettings', autoLoginSettings)
                        .component('maActiveEventIcons', activeEventIcons)
                        .component('dateBar', dateBar);
                    $ocLazyLoad.inject('dashboard');
                });
            }]
        }
    },
    {
        name: 'dashboard.notFound',
        url: '/not-found?path',
        templateUrl: 'views/dashboard/notFound.html',
        menuHidden: true,
        menuTr: 'dashboards.v3.app.pageNotFound'
    },
    {
        name: 'login',
        url: '/login',
        templateUrl: 'views/login.html',
        menuHidden: true,
        menuIcon: 'exit_to_app',
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
        name: 'logout',
        url: '/logout',
        menuHidden: true,
        menuIcon: 'power_settings_new',
        menuTr: 'header.logout',
        template: '<div></div>'
    },
    {
        name: 'dashboard.home',
        url: '/home',
        templateUrl: 'views/dashboard/home.html',
        menuTr: 'dashboards.v3.dox.home',
        menuIcon: 'home'
    },
    {
        name: 'dashboard.demoPage1',
        url: '/demo-page-1',
        linkToPage: true,
        pageXid: 'demo-page-1',
        menuText: 'Demo Page 1',
        menuIcon: 'favorite'
    },
    {
        name: 'dashboard.demoFolder',
        url: '/demo-folder',
        menuText: 'Demo Folder',
        menuIcon: 'folder',
        children: [
            {
                name: 'dashboard.demoFolder.demoPage2',
                url: '/demo-page-2',
                linkToPage: true,
                pageXid: 'demo-page-2',
                menuText: 'Demo Page 2',
                menuIcon: 'cake'
            }
        ]
    },
    {
        name: 'dashboard.watchList',
        url: '/watch-list/{watchListXid}?dataSourceXid&deviceName&hierarchyFolderId',
        template: '<ma-watch-list-page flex="noshrink" layout="column"></ma-watch-list-page>',
        menuTr: 'dashboards.v3.app.watchList',
        menuIcon: 'remove_red_eye',
        params: {
            dateBar: {
                rollupControls: true
            }
        },
        resolve: {
            loadMyDirectives: ['rQ', '$ocLazyLoad', 'cssInjector', function(rQ, $ocLazyLoad, cssInjector) {
                return rQ(['./components/watchListPage/watchListPage',
                            './directives/watchList/watchListTable',
                            './directives/watchList/watchListTableRow',
                            './directives/watchList/watchListChart'], 
                function (WatchlistPage, watchListTable, watchListTableRow, watchListChart) {
                    angular.module('watchListPage', [])
                        .component('maWatchListPage', WatchlistPage)
                        .directive('watchListTable', watchListTable)
                        .directive('watchListTableRow', watchListTableRow)
                        .directive('watchListChart', watchListChart)
                        .filter('noNaN', function () {
                                return function (input, suffix) {
                                      if (isNaN(input)) { return '...'; }
                                      else { return input.toFixed(1) + suffix; }
                                }
                          });
                    $ocLazyLoad.inject('watchListPage');
                    cssInjector.injectLink(require.toUrl('./components/watchListPage/watchListPage.css'),'watchlistPageStyles','link[href="styles/main.css"]');
                });
            }]
        }
    },
    {
        name: 'dashboard.dataPointDetails',
        url: '/data-point-details/{pointXid}',
        template: '<ma-data-point-details></ma-data-point-details>',
        menuTr: 'dashboards.v3.app.dataPointDetails',
        menuIcon: 'timeline',
        params: {
            dateBar: {
                rollupControls: true
            }
        },
        resolve: {
            loadMyDirectives: ['rQ', '$ocLazyLoad', 'cssInjector', function(rQ, $ocLazyLoad, cssInjector) {
                return rQ(['./components/dataPointDetails/dataPointDetails'], function (dataPointDetails) {
                    angular.module('dataPointDetailsPage', [])
                        .component('maDataPointDetails', dataPointDetails);
                    $ocLazyLoad.inject('dataPointDetailsPage');
                    cssInjector.injectLink(require.toUrl('./components/dataPointDetails/dataPointDetails.css'), 'dataPointDetails' ,'link[href="styles/main.css"]');
                });
            }]
        }
    },
    {
        name: 'dashboard.events',
        url: '/events?eventType&alarmLevel&sortOrder&acknowledged',
        template: '<ma-events-page></ma-events-page>',
        menuTr: 'dashboards.v3.app.events',
        menuIcon: 'alarm',
        params: {
            dateBar: {}
        },
        resolve: {
            loadMyDirectives: ['rQ', '$ocLazyLoad', 'cssInjector', function(rQ, $ocLazyLoad, cssInjector) {
                return rQ(['./components/eventsPage/eventsPage'], function (eventsPage) {
                    angular.module('eventsPage', [])
                        .component('maEventsPage', eventsPage);
                    $ocLazyLoad.inject('eventsPage');
                    cssInjector.injectLink(require.toUrl('./components/eventsPage/eventsPage.css'), 'eventsPage' ,'link[href="styles/main.css"]');
                });
            }]
        }

    },
    {
        url: '/help',
        name: 'dashboard.help',
        template: '<iframe-view src="/help.htm"></iframe-view>',
        menuTr: 'header.help',
        menuIcon: 'help'
    },
    {
        name: 'dashboard.apiErrors',
        url: '/api-errors',
        templateUrl: 'views/dashboard/errors.html',
        menuTr: 'dashboards.v3.dox.apiErrors',
        menuIcon: 'warning',
        menuHidden: true
    },
    {
        url: '/view-page/{pageXid}',
        name: 'dashboard.viewPage',
        template: '<page-view xid="{{pageXid}}"></page-view>',
        menuTr: 'dashboards.v3.app.viewPage',
        menuHidden: true,
        controller: ['$scope', '$stateParams', function ($scope, $stateParams) {
            $scope.pageXid = $stateParams.pageXid;
        }]
    },
    {
        url: '/settings',
        name: 'dashboard.settings',
        menuIcon: 'build',
        menuTr: 'dashboards.v3.app.adminTools',
        children: [
            {
                url: '/edit-pages/{pageXid}',
                name: 'dashboard.settings.editPages',
                templateUrl: 'views/dashboard/editPages.html',
                menuTr: 'dashboards.v3.app.editPages',
                menuIcon: 'dashboard',
                permission: 'edit-pages',
                params: {
                    markup: null,
                    templateUrl: null
                }
            },
            {
                url: '/edit-menu',
                name: 'dashboard.settings.editMenu',
                templateUrl: 'views/dashboard/editMenu.html',
                menuTr: 'dashboards.v3.app.editMenu',
                menuIcon: 'toc',
                permission: 'edit-menus'
            },
            {
                url: '/auto-login-settings',
                name: 'dashboard.settings.autoLoginSettings',
                templateUrl: 'views/dashboard/autoLoginSettings.html',
                menuTr: 'dashboards.v3.app.autoLoginSettings',
                menuIcon: 'face',
                permission: 'superadmin'
            },
            {
                name: 'dashboard.settings.watchListBuilder',
                url: '/watch-list-builder/{watchListXid}',
                template: '<h1 ma-tr="dashboards.v3.app.watchListBuilder"></h1>\n<watch-list-builder></watch-list-builder>',
                menuTr: 'dashboards.v3.app.watchListBuilder',
                menuIcon: 'playlist_add_check',
                params: {
                    watchList: null
                },
                resolve: {
                    loadMyDirectives: ['rQ', '$ocLazyLoad', 'cssInjector', function(rQ, $ocLazyLoad, cssInjector) {
                        return rQ(['./components/watchListBuilder/watchListBuilder'], function (watchListBuilder) {
                            angular.module('watchListBuilder', [])
                                .component('watchListBuilder', watchListBuilder);
                            $ocLazyLoad.inject('watchListBuilder');
                            cssInjector.injectLink(require.toUrl('./components/watchListBuilder/watchListBuilder.css'), 'watchListBuilder' ,'link[href="styles/main.css"]');
                        });
                    }]
                }
            },
            {
                url: '/system-settings',
                name: 'dashboard.settings.systemSettings',
                template: '<iframe-view src="/system_settings.shtm"></iframe-view>',
                menuTr: 'header.systemSettings',
                menuIcon: 'settings',
                permission: 'superadmin'
            },
            {
                url: '/data-sources',
                name: 'dashboard.settings.dataSources',
                template: '<iframe-view src="/data_sources.shtm"></iframe-view>',
                menuTr: 'header.dataSources',
                menuIcon: 'device_hub',
                permission: 'superadmin'
            },
            {
                url: '/users',
                name: 'dashboard.settings.users',
                template: '<iframe-view src="/users.shtm"></iframe-view>',
                menuTr: 'header.users',
                menuIcon: 'people',
                permission: 'superadmin'
            },
            {
                url: '/events',
                name: 'dashboard.settings.events',
                template: '<iframe-view src="/events.shtm"></iframe-view>',
                menuTr: 'header.alarms',
                menuIcon: 'alarm',
                permission: 'superadmin'
            },
            {
                url: '/import-export',
                name: 'dashboard.settings.importExport',
                template: '<iframe-view src="/emport.shtm"></iframe-view>',
                menuTr: 'header.emport',
                menuIcon: 'import_export',
                permission: 'superadmin'
            },
            {
                url: '/modules',
                name: 'dashboard.settings.modules',
                template: '<iframe-view src="/modules.shtm"></iframe-view>',
                menuTr: 'header.modules',
                menuIcon: 'extension',
                permission: 'superadmin'
            },
            {
                url: '/sql-console',
                name: 'dashboard.settings.sqlConsole',
                template: '<iframe-view src="/sqlConsole.shtm"></iframe-view>',
                menuTr: 'header.sql',
                menuIcon: 'storage',
                permission: 'superadmin'
            },
            {
                url: '/no-sql',
                name: 'dashboard.settings.noSql',
                template: '<iframe-view src="/mango_no_sql.shtm"></iframe-view>',
                menuTr: 'mangoNoSql.header.icontext',
                menuIcon: 'not_interested',
                permission: 'superadmin'
            },
            {
                url: '/internal-metrics',
                name: 'dashboard.settings.internalMetrics',
                template: '<iframe-view src="/internal/status.shtm"></iframe-view>',
                menuTr: 'dox.internalMetrics',
                menuIcon: 'memory',
                permission: 'superadmin'
            },
            {
                url: '/mailing-lists',
                name: 'dashboard.settings.mailingLists',
                template: '<iframe-view src="/mailing_lists.shtm"></iframe-view>',
                menuTr: 'header.mailingLists',
                menuIcon: 'email',
                permission: 'superadmin'
            },
            {
                url: '/publishers',
                name: 'dashboard.settings.publishers',
                template: '<iframe-view src="/publishers.shtm"></iframe-view>',
                menuTr: 'header.publishers',
                menuIcon: 'publish',
                permission: 'superadmin'
            },
            {
                url: '/event-handlers',
                name: 'dashboard.settings.eventHandlers',
                template: '<iframe-view src="/event_handlers.shtm"></iframe-view>',
                menuTr: 'header.eventHandlers',
                menuIcon: 'change_history',
                permission: 'superadmin'
            },
            {
                url: '/point-hierarchy',
                name: 'dashboard.settings.pointHierarchy',
                template: '<iframe-view src="/point_hierarchy.shtm"></iframe-view>',
                menuTr: 'header.pointHierarchy',
                menuIcon: 'folder',
                permission: 'superadmin'
            },
            {
                url: '/reports',
                name: 'dashboard.settings.reports',
                template: '<iframe-view src="/reports.shtm"></iframe-view>',
                menuTr: 'header.reports',
                menuIcon: 'book',
                permission: 'superadmin'
            }
        ]
    },
    {
        name: 'dashboard.examples',
        url: '/examples',
        menuTr: 'dashboards.v3.dox.examples',
        menuIcon: 'info',
        submenu: true,
        children: [
            {
                url: '/play-area',
                name: 'dashboard.examples.playArea',
                templateUrl: 'views/examples/playArea.html',
                menuTr: 'dashboards.v3.dox.playArea',
                menuIcon: 'fa-magic',
                params: {
                    markup: null
                }
            },
            {
                name: 'dashboard.examples.playAreaBig',
                templateUrl: 'views/examples/playAreaBig.html',
                url: '/play-area-big',
                menuTr: 'dashboards.v3.dox.playAreaBig',
                menuHidden: true,
                menuIcon: 'fa-magic'
            },
            {
                name: 'dashboard.examples.basics',
                url: '/basics',
                menuTr: 'dashboards.v3.dox.basics',
                menuIcon: 'fa-info-circle',
                children: [
                    {
                        name: 'dashboard.examples.basics.pagesAndMenu',
                        templateUrl: 'views/examples/pagesAndMenu.html',
                        url: '/pages-and-menu',
                        menuTr: 'dashboards.v3.dox.pagesAndMenu'
                    },
                    {
                        name: 'dashboard.examples.basics.createDashboard',
                        templateUrl: 'views/examples/createDashboard.html',
                        url: '/create-dashboard',
                        menuTr: 'dashboards.v3.dox.createDashboard'
                    },
                    {
                        name: 'dashboard.examples.basics.angular',
                        templateUrl: 'views/examples/angular.html',
                        url: '/angular',
                        menuTr: 'dashboards.v3.dox.angular'
                    },
                    {
                        name: 'dashboard.examples.basics.pointList',
                        templateUrl: 'views/examples/pointList.html',
                        url: '/point-list',
                        menuTr: 'dashboards.v3.dox.pointList'
                    },
                    {
                        name: 'dashboard.examples.basics.getPointByXid',
                        templateUrl: 'views/examples/getPointByXid.html',
                        url: '/get-point-by-xid',
                        menuTr: 'dashboards.v3.dox.getPointByXid'
                    },
                    {
                        name: 'dashboard.examples.basics.dataSourceAndDeviceList',
                        templateUrl: 'views/examples/dataSourceAndDeviceList.html',
                        url: '/data-source-and-device-list',
                        menuTr: 'dashboards.v3.dox.dataSourceAndDeviceList'
                    },
                    {
                        name: 'dashboard.examples.basics.liveValues',
                        templateUrl: 'views/examples/liveValues.html',
                        url: '/live-values',
                        menuTr: 'dashboards.v3.dox.liveValues'
                    },
                    {
                        name: 'dashboard.examples.basics.filters',
                        templateUrl: 'views/examples/filters.html',
                        url: '/filters',
                        menuTr: 'dashboards.v3.dox.filters'
                    },
                    {
                        name: 'dashboard.examples.basics.datePresets',
                        templateUrl: 'views/examples/datePresets.html',
                        url: '/date-presets',
                        menuTr: 'dashboards.v3.dox.datePresets'
                    },
                    {
                        name: 'dashboard.examples.basics.styleViaValue',
                        templateUrl: 'views/examples/styleViaValue.html',
                        url: '/style-via-value',
                        menuTr: 'dashboards.v3.dox.styleViaValue'
                    },
                    {
                        name: 'dashboard.examples.basics.pointValues',
                        templateUrl: 'views/examples/pointValues.html',
                        url: '/point-values',
                        menuTr: 'dashboards.v3.dox.pointValues'
                    },
                    {
                        name: 'dashboard.examples.basics.latestPointValues',
                        templateUrl: 'views/examples/latestPointValues.html',
                        url: '/latest-point-values',
                        menuTr: 'dashboards.v3.dox.latestPointValues'
                    },
                    {
                        name: 'dashboard.examples.basics.clocksAndTimezones',
                        templateUrl: 'views/examples/clocksAndTimezones.html',
                        url: '/clocks-and-timezones',
                        menuTr: 'dashboards.v3.dox.clocksAndTimezones'
                    }
                ]
            },
            {
                name: 'dashboard.examples.singleValueDisplays',
                url: '/single-value-displays',
                menuTr: 'dashboards.v3.dox.singleValueDisplays',
                menuIcon: 'fa-tachometer',
                children: [
                    {
                        name: 'dashboard.examples.singleValueDisplays.gauges',
                        templateUrl: 'views/examples/gauges.html',
                        url: '/gauges',
                        menuTr: 'dashboards.v3.dox.gauges'
                    },
                    {
                        name: 'dashboard.examples.singleValueDisplays.switchImage',
                        templateUrl: 'views/examples/switchImage.html',
                        url: '/switch-image',
                        menuTr: 'dashboards.v3.dox.switchImage'
                    },
                    {
                        name: 'dashboard.examples.singleValueDisplays.bars',
                        templateUrl: 'views/examples/bars.html',
                        url: '/bars',
                        menuTr: 'dashboards.v3.dox.bars'
                    },
                    {
                        name: 'dashboard.examples.singleValueDisplays.tanks',
                        templateUrl: 'views/examples/tanks.html',
                        url: '/tanks',
                        menuTr: 'dashboards.v3.dox.tanks'
                    }
                ]
            },
            {
                name: 'dashboard.examples.charts',
                url: '/charts',
                menuTr: 'dashboards.v3.dox.charts',
                menuIcon: 'fa-area-chart',
                children: [
                    {
                        name: 'dashboard.examples.charts.lineChart',
                        templateUrl: 'views/examples/lineChart.html',
                        url: '/line-chart',
                        menuTr: 'dashboards.v3.dox.lineChart'
                    },
                    {
                        name: 'dashboard.examples.charts.barChart',
                        templateUrl: 'views/examples/barChart.html',
                        url: '/bar-chart',
                        menuTr: 'dashboards.v3.dox.barChart'
                    },
                    {
                        name: 'dashboard.examples.charts.advancedChart',
                        templateUrl: 'views/examples/advancedChart.html',
                        url: '/advanced-chart',
                        menuTr: 'dashboards.v3.dox.advancedChart'
                    },
                    {
                        name: 'dashboard.examples.charts.stateChart',
                        templateUrl: 'views/examples/stateChart.html',
                        url: '/state-chart',
                        menuTr: 'dashboards.v3.dox.stateChart'
                    },
                    {
                        name: 'dashboard.examples.charts.liveUpdatingChart',
                        templateUrl: 'views/examples/liveUpdatingChart.html',
                        url: '/live-updating-chart',
                        menuTr: 'dashboards.v3.dox.liveUpdatingChart'
                    },
                    {
                        name: 'dashboard.examples.charts.pieChart',
                        templateUrl: 'views/examples/pieChart.html',
                        url: '/pie-chart',
                        menuTr: 'dashboards.v3.dox.pieChart'
                    },
                    {
                        name: 'dashboard.examples.charts.dailyComparison',
                        templateUrl: 'views/examples/dailyComparisonChart.html',
                        url: '/daily-comparison',
                        menuTr: 'dashboards.v3.dox.dailyComparisonChart'
                    }
                ]
            },
            {
                name: 'dashboard.examples.settingPointValues',
                url: '/setting-point-values',
                menuTr: 'dashboards.v3.dox.settingPoint',
                menuIcon: 'fa-pencil-square-o',
                children: [
                    {
                        name: 'dashboard.examples.settingPointValues.setPoint',
                        templateUrl: 'views/examples/setPoint.html',
                        url: '/set-point',
                        menuTr: 'dashboards.v3.dox.settingPoint'
                    },
                    {
                        name: 'dashboard.examples.settingPointValues.toggle',
                        templateUrl: 'views/examples/toggle.html',
                        url: '/toggle',
                        menuTr: 'dashboards.v3.dox.toggle'
                    },
                    {
                        name: 'dashboard.examples.settingPointValues.sliders',
                        templateUrl: 'views/examples/sliders.html',
                        url: '/sliders',
                        menuTr: 'dashboards.v3.dox.sliders'
                    },
                    {
                        name: 'dashboard.examples.settingPointValues.multistateRadio',
                        templateUrl: 'views/examples/multistateRadio.html',
                        url: '/multistate-radio-buttons',
                        menuTr: 'dashboards.v3.dox.multistateRadio'
                    }
                ]
            },
            {
                name: 'dashboard.examples.statistics',
                url: '/statistics',
                menuTr: 'dashboards.v3.dox.statistics',
                menuIcon: 'fa-table',
                children: [
                    {
                        name: 'dashboard.examples.statistics.getStatistics',
                        templateUrl: 'views/examples/getStatistics.html',
                        url: '/get-statistics',
                        menuTr: 'dashboards.v3.dox.getStatistics'
                    },
                    {
                        name: 'dashboard.examples.statistics.statisticsTable',
                        templateUrl: 'views/examples/statisticsTable.html',
                        url: '/statistics-table',
                        menuTr: 'dashboards.v3.dox.statisticsTable'
                    },
                    {
                        name: 'dashboard.examples.statistics.statePieChart',
                        templateUrl: 'views/examples/statePieChart.html',
                        url: '/state-pie-chart',
                        menuTr: 'dashboards.v3.dox.statePieChart'
                    }
                ]
            },
            {
                name: 'dashboard.examples.pointArrays',
                url: '/point-arrays',
                menuTr: 'dashboards.v3.dox.pointArrayTemplating',
                menuIcon: 'fa-list',
                children: [
                    {
                        name: 'dashboard.examples.pointArrays.buildPointArray',
                        templateUrl: 'views/examples/buildPointArray.html',
                        url: '/build-point-array',
                        menuTr: 'dashboards.v3.dox.buildPointArray'
                    },
                    {
                        name: 'dashboard.examples.pointArrays.pointArrayTable',
                        templateUrl: 'views/examples/pointArrayTable.html',
                        url: '/point-array-table',
                        menuTr: 'dashboards.v3.dox.pointArrayTable'
                    },
                    {
                        name: 'dashboard.examples.pointArrays.pointArrayLineChart',
                        templateUrl: 'views/examples/pointArrayLineChart.html',
                        url: '/point-array-line-chart',
                        menuTr: 'dashboards.v3.dox.pointArrayLineChart'
                    },
                    {
                        name: 'dashboard.examples.pointArrays.templating',
                        templateUrl: 'views/examples/templating.html',
                        url: '/templating',
                        menuTr: 'dashboards.v3.dox.templating'
                    },
                    {
                        name: 'dashboard.examples.pointArrays.dataPointTable',
                        templateUrl: 'views/examples/dataPointTable.html',
                        url: '/data-point-table',
                        menuTr: 'dashboards.v3.dox.dataPointTable'
                    }
                ]
            },
            {
                name: 'dashboard.examples.pointHierarchy',
                url: '/point-hierarchy',
                menuTr: 'dashboards.v3.dox.pointHierarchy',
                menuIcon: 'fa-sitemap',
                children: [
                    {
                        name: 'dashboard.examples.pointHierarchy.displayTree',
                        templateUrl: 'views/examples/displayTree.html',
                        url: '/display-tree',
                        menuTr: 'dashboards.v3.dox.displayTree'
                    },
                    {
                        name: 'dashboard.examples.pointHierarchy.pointHierarchyLineChart',
                        templateUrl: 'views/examples/pointHierarchyLineChart.html',
                        url: '/line-chart',
                        menuTr: 'dashboards.v3.dox.pointHierarchyLineChart'
                    }
                ]
            },
            {
                name: 'dashboard.examples.templates',
                url: '/templates',
                menuTr: 'dashboards.v3.dox.templates',
                menuIcon: 'fa-file-o',
                children: [
                    {
                        name: 'dashboard.examples.templates.angularMaterial',
                        templateUrl: 'views/examples/angularMaterial.html',
                        url: '/angular-material',
                        menuText: 'Angular Material'
                    },
                    {
                        name: 'dashboard.examples.templates.bootstrap',
                        templateUrl: 'views/examples/bootstrap.html',
                        url: '/bootstrap',
                        menuText: 'Bootstrap 3'
                    },
                    {
                        name: 'dashboard.examples.templates.autoLogin',
                        templateUrl: 'views/examples/autoLogin.html',
                        url: '/auto-login',
                        menuTr: 'dashboards.v3.dox.autoLogin'
                    },
                    {
                        name: 'dashboard.examples.templates.extendApp',
                        templateUrl: 'views/examples/extendApp.html',
                        url: '/extend-app',
                        menuTr: 'dashboards.v3.dox.extendApp'
                    },
                    {
                        name: 'dashboard.examples.templates.loginPage',
                        templateUrl: 'views/examples/loginPageTemplate.html',
                        url: '/login-page',
                        menuTr: 'dashboards.v3.dox.loginPageTemplate'
                    },
                    {
                        name: 'dashboard.examples.templates.adminTemplate',
                        templateUrl: 'views/examples/adminTemplate.html',
                        url: '/admin-template',
                        menuTr: 'dashboards.v3.dox.adminTemplate'
                    },
                    {
                        name: 'dashboard.examples.templates.adaptiveLayouts',
                        templateUrl: 'views/examples/adaptiveLayouts.html',
                        url: '/adaptive-layouts',
                        menuText: 'Adaptive Layouts'
                    }
                ]
            },
            {
                name: 'dashboard.examples.utilities',
                url: '/utilities',
                menuTr: 'dashboards.v3.dox.utilities',
                menuIcon: 'fa-wrench',
                children: [
                    {
                        name: 'dashboard.examples.utilities.translation',
                        templateUrl: 'views/examples/translation.html',
                        url: '/translation',
                        menuTr: 'dashboards.v3.dox.translation'
                    },
                    {
                        name: 'dashboard.examples.utilities.jsonStore',
                        templateUrl: 'views/examples/jsonStore.html',
                        url: '/json-store',
                        menuTr: 'dashboards.v3.dox.jsonStore'
                    },
                    {
                        name: 'dashboard.examples.utilities.watchdog',
                        templateUrl: 'views/examples/watchdog.html',
                        url: '/watchdog',
                        menuTr: 'dashboards.v3.dox.watchdog'
                    }
                ]
            }
        ]
    }
]);

mdAdminApp.constant('DEFAULT_PAGES', [
    {
        xid: 'demo-page-1',
        name: 'Demo Page 1',
        editPermission: 'edit-pages',
        readPermission: 'user',
        markup: '<h1>Demo page 1</h1>\n<p>You can edit this page by clicking the pencil at the top right of the page.</p>'
    },
    {
        xid: 'demo-page-2',
        name: 'Demo Page 2',
        editPermission: 'edit-pages',
        readPermission: 'user',
        markup: '<h1>Demo page 2</h1>\n<p>You can edit this page by clicking the pencil at the top right of the page.</p>'
    }
]);

mdAdminApp.config([
    'MENU_ITEMS',
    'MD_ADMIN_SETTINGS',
    'DASHBOARDS_NG_DOCS',
    '$stateProvider',
    '$urlRouterProvider',
    '$ocLazyLoadProvider',
    '$httpProvider',
    '$mdThemingProvider',
    '$injector',
    '$compileProvider',
    'mangoStateProvider',
    '$locationProvider',
    '$mdAriaProvider',
    'errorInterceptorProvider',
    'cfpLoadingBarProvider',
function(MENU_ITEMS, MD_ADMIN_SETTINGS, DASHBOARDS_NG_DOCS, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider,
        $httpProvider, $mdThemingProvider, $injector, $compileProvider, mangoStateProvider, $locationProvider, $mdAriaProvider,
        errorInterceptorProvider, cfpLoadingBarProvider) {

    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    
    errorInterceptorProvider.ignore = function(rejection) {
        var ignoreUrls = ['/rest/v1/json-data/custom-user-menu',
                          '/rest/v1/json-data/custom-user-pages',
                          '/rest/v1/json-data/demo-page-1',
                          '/rest/v1/json-data/demo-page-2',
                          '/rest/v1/json-data/play-area-'];

        if (!rejection.config)
            return false;
        
        var url = rejection.config.url;
        
        if (url.indexOf('/rest/v1/users/current') >= 0) {
            if (rejection.config.method === 'OPTIONS')
                return true;
        }
        
        if (rejection.status === 404 && rejection.config.method === 'GET') {
            for (var i = 0; i < ignoreUrls.length; i++) {
                if (url.indexOf(ignoreUrls[i]) >= 0)
                    return true;
            }
        }
        return false;
    };

    if (MD_ADMIN_SETTINGS.palettes) {
        for (var name in MD_ADMIN_SETTINGS.palettes) {
            $mdThemingProvider.definePalette(name, MD_ADMIN_SETTINGS.palettes[name]);
        }
    }

    if (MD_ADMIN_SETTINGS.themes) {
        for (var name in MD_ADMIN_SETTINGS.themes) {
            var themeSettings = MD_ADMIN_SETTINGS.themes[name];
            var theme = $mdThemingProvider.theme(name);
            if (themeSettings.primaryPalette) {
                theme.primaryPalette(themeSettings.primaryPalette, themeSettings.primaryPaletteHues);
            }
            if (themeSettings.accentPalette) {
                theme.accentPalette(themeSettings.accentPalette, themeSettings.accentPaletteHues);
            }
            if (themeSettings.warnPalette) {
                theme.warnPalette(themeSettings.warnPalette, themeSettings.warnPaletteHues);
            }
            if (themeSettings.backgroundPalette) {
                theme.backgroundPalette(themeSettings.backgroundPalette, themeSettings.backgroundPaletteHues);
            }
            if (themeSettings.dark) {
                theme.dark();
            }
        }
    }

    var theme = MD_ADMIN_SETTINGS.defaultTheme || 'mangoDefault';
    $mdThemingProvider.setDefaultTheme(theme);
    $mdThemingProvider.enableBrowserColor({
        theme: theme
    });

    $httpProvider.interceptors.push('errorInterceptor');
    $httpProvider.useApplyAsync(true);

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

    //$stateProvider.reloadOnSearch = false;
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise(function($injector, $location) {
        var MD_ADMIN_SETTING = $injector.get('MD_ADMIN_SETTINGS');
        var $state = $injector.get('$state');
        var user = MD_ADMIN_SETTINGS.user;
        
        var path = '/dashboards/';
        if ($location.path()) {
            path += $location.path().substring(1);
        }
        
        if (!user) {
            $state.loginRedirectUrl = path;
            return '/login';
        }
        
        if (path === '/dashboards/') {
            var homeUrl = user.homeUrl;
            if (homeUrl && homeUrl.indexOf('/dashboards') === 0) {
                return homeUrl.substring(11); // strip dashboards from start of url
            }
            if (MD_ADMIN_SETTINGS.defaultUrl) {
                return MD_ADMIN_SETTINGS.defaultUrl;
            }
            return '/home';
        }

        return '/not-found?path=' + encodeURIComponent(path);
    });

    var docsParent = {
        name: 'dashboard.docs',
        url: '/docs',
        menuText: 'API Docs',
        menuIcon: 'book',
        submenu: true,
        children: [],
        resolve: {
            prettyprint: ['rQ', '$ocLazyLoad', function(rQ, $ocLazyLoad) {
                return rQ(['./directives/prettyprint/prettyprint'], function(prettyprint) {
                    angular.module('prettyprint', [])
                        .directive('prettyprint', prettyprint);
                    $ocLazyLoad.inject('prettyprint');
                });
            }]
        }
    };
    MENU_ITEMS.push(docsParent);

    var DOCS_PAGES = DASHBOARDS_NG_DOCS.pages;
    var moduleItem = {};

    // Loop through and create array of children based on moduleName
    var modules = DOCS_PAGES.map(function(page) {return page.moduleName})
    .filter(function(item, index, array) {
        return index == array.indexOf(item);
    });

    // Create module menu items & states
    modules.forEach(function(item, index, array) {
        var dashCaseUrl = item.replace(/[A-Z]/g, function(c) { return '-' + c.toLowerCase(); });

        var menuText = item;
        if (item==='maDashboards') { menuText = 'Directives' }
        else if (item==='maFilters') { menuText = 'Filters' }
        else if (item==='maServices') { menuText = 'Services' }

        var menuItem = {
            name: 'dashboard.docs.' + item,
            url: '/' + dashCaseUrl,
            menuText: menuText,
            children: []
        };

        moduleItem[item] = menuItem;

        docsParent.children.push(menuItem);
    });

    // Create 3rd level directives/services/filters docs pages
    // First remove module items
    var components = DOCS_PAGES.map(function(page) {return page.id})
    .filter(function(item, index, array) {
        return item.indexOf('.') !== -1;
    });

    // Add each component item
    components.forEach(function(item, index, array) {
        var splitAtDot = item.split('.');
        var dashCaseUrl = splitAtDot[1].replace(/[A-Z]/g, function(c) { return '-' + c.toLowerCase(); });
		if(dashCaseUrl.charAt(0) === '-') { dashCaseUrl = dashCaseUrl.slice(1)}
        var menuText = splitAtDot[1];
        if (splitAtDot[0] === 'maDashboards') { menuText = dashCaseUrl}
        var menuItem = {
            name: 'dashboard.docs.' + item,
            templateUrl: require.toUrl('./views/docs/' + item + '.html'),
            url: '/' + dashCaseUrl,
            menuText: menuText
        };
        moduleItem[splitAtDot[0]].children.push(menuItem);
    });

    mangoStateProvider.addStates(MENU_ITEMS);
    if (MD_ADMIN_SETTINGS.customMenuItems)
        mangoStateProvider.addStates(MD_ADMIN_SETTINGS.customMenuItems);
    
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
}]);

mdAdminApp.run([
    'MENU_ITEMS',
    '$rootScope',
    '$state',
    '$timeout',
    '$mdSidenav',
    '$mdMedia',
    '$mdColors',
    '$MD_THEME_CSS',
    'cssInjector',
    '$mdToast',
    'User',
    'MD_ADMIN_SETTINGS',
    'Translate',
    '$location',
    '$stateParams',
    'DateBar',
function(MENU_ITEMS, $rootScope, $state, $timeout, $mdSidenav, $mdMedia, $mdColors, $MD_THEME_CSS, cssInjector,
        $mdToast, User, MD_ADMIN_SETTINGS, Translate, $location, $stateParams, DateBar) {

    MD_ADMIN_SETTINGS.stateParams = $stateParams;
    $rootScope.dateBar = DateBar;
    $rootScope.mdAdmin = MD_ADMIN_SETTINGS;
    $rootScope.user = MD_ADMIN_SETTINGS.user;
    $rootScope.menuItems = MENU_ITEMS;
    $rootScope.Math = Math;
    $rootScope.$mdMedia = $mdMedia;
    $rootScope.$state = $state;

    // inserts a style tag to style <a> tags with accent color
    if ($MD_THEME_CSS) {
        var accent500 = $mdColors.getThemeColor('accent-500-1.0');
        var accent500Clear = $mdColors.getThemeColor('accent-500-0.2');
        var accent700 = $mdColors.getThemeColor('accent-700-1.0');
        var styleContent =
            'a:not(.md-button) {color: ' + accent500 +'; border-bottom-color: ' + accent500Clear + ';}\n' +
            'a:not(.md-button):hover, a:not(.md-button):focus {color: ' + accent700 + '; border-bottom-color: ' + accent700 + ';}\n';

        cssInjector.injectStyle(styleContent, null, '[md-theme-style]');

        var mdTableStyles = 'table.md-table.md-row-select tbody.md-body>tr.md-row.md-selected {\n' +
            '  background-color: ' + $mdColors.getThemeColor('background-400-0.4') + ' !important;\n' +
            '}\n\n' +
            'table.md-table.md-row-select tbody.md-body>tr.md-row:not([disabled]):hover {\n' +
            '  background-color: ' + $mdColors.getThemeColor('background-400-0.6') + ' !important;\n' +
            '}\n';
        cssInjector.injectStyle(mdTableStyles, null, '[href="styles/main.css"]', true);
    }

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        if (error && (error === 'No user' || error.status === 401 || error.status === 403)) {
            event.preventDefault();
            $state.loginRedirectUrl = $state.href(toState, toParams);
            $state.go('login');
        } else {
            console.log(error);
            //$state.go('dashboard.home');
        }
    });

    $rootScope.titleSuffix = 'Mango Dashboards v3';
    $rootScope.setTitleText = function setTitleText() {
        if ($state.$current.menuText) {
            this.titleText = $state.$current.menuText + ' - ' + this.titleSuffix;
        } else if ($state.$current.menuTr) {
            Translate.tr($state.$current.menuTr).then(function(text) {
                this.titleText = text + ' - ' + this.titleSuffix;
            }.bind(this), function() {
                this.titleText = this.titleSuffix;
            }.bind(this));
        } else {
            this.titleText = this.titleSuffix;
        }
    };
    
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        var crumbs = [];
        var state = $state.$current;
        do {
            if (state.menuTr) {
                crumbs.unshift({stateName: state.name, maTr: state.menuTr});
            } else if (state.menuText) {
                crumbs.unshift({stateName: state.name, text: state.menuText});
            }
        } while (state = state.parent);
        $rootScope.crumbs = crumbs;
        
        $rootScope.setTitleText();
        
        if (toState !== fromState) {
            var contentDiv = document.querySelector('.main-content');
            if (contentDiv) {
                contentDiv.scrollTop = 0;
            }
        }
        
        DateBar.rollupTypesFilter = {};
    });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if ($state.includes('dashboard') && !$rootScope.navLockedOpen) {
            $rootScope.closeMenu();
        }
        if (toState.name === 'logout') {
            event.preventDefault();
            User.logout().$promise.then(null, function() {
                // consume error
            }).then(function() {
                $rootScope.user = null;
                MD_ADMIN_SETTINGS.user = null;
                $state.go('login');
            });
        }
    });
    
    // wait for the dashboard view to be loaded then set it to open if the
    // screen is a large one. By default the internal state of the sidenav thinks
    // it is closed even if it is locked open
    $rootScope.$on('$viewContentLoaded', function(event, view) {
        if (view === '@dashboard') {
            if ($mdMedia('gt-sm')) {
                $rootScope.openMenu();
            }
            
            // the closeMenu() function already does this but we need this for when the ESC key is pressed
            // which just calls $mdSidenav(..).close();
            $mdSidenav('left').onClose(function () {
                $rootScope.navLockedOpen = false;
            });
        }
    });

    // automatically open or close the menu when the screen size is changed
    $rootScope.$watch($mdMedia.bind($mdMedia, 'gt-sm'), function(gtSm, prev) {
        if (gtSm === prev) return; // ignore first "change"
        
        var sideNav = $mdSidenav('left');
        if (gtSm && !sideNav.isOpen()) {
            sideNav.open();
        }
        if (!gtSm && sideNav.isOpen()) {
            sideNav.close();
        }
        $rootScope.navLockedOpen = gtSm;
    });
    
    $rootScope.toggleMenu = function() {
        var sideNav = $mdSidenav('left');
        if (sideNav.isOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    };

    $rootScope.closeMenu = function() {
        angular.element('#menu-button').blur();
        $rootScope.navLockedOpen = false;
        $mdSidenav('left').close();
    };

    $rootScope.openMenu = function() {
        angular.element('#menu-button').blur();
        if ($mdMedia('gt-sm')) {
            $rootScope.navLockedOpen = true;
        }
        $mdSidenav('left').open();
    };

    /**
     * Watchdog timer alert and re-connect/re-login code
     */

    $rootScope.$on('mangoWatchdog', function(event, current, previous) {
        var message;
        var hideDelay = 0; // dont auto hide message

        if (current.status === previous.status)
            return;

        switch(current.status) {
        case 'API_DOWN':
            message = Translate.trSync('dashboards.v3.app.apiDown');
            MD_ADMIN_SETTINGS.user = null;
            break;
        case 'STARTING_UP':
            message = Translate.trSync('dashboards.v3.app.startingUp');
            MD_ADMIN_SETTINGS.user = null;
            break;
        case 'API_ERROR':
            message = Translate.trSync('dashboards.v3.app.returningErrors');
            MD_ADMIN_SETTINGS.user = null;
            break;
        case 'API_UP':
            if (previous.status && previous.status !== 'LOGGED_IN')
                message = Translate.trSync('dashboards.v3.app.connectivityRestored');
            hideDelay = 5000;
            MD_ADMIN_SETTINGS.user = null;

            // do automatic re-login if we are not on the login page
            if (!$state.includes('login')) {
                User.autoLogin().then(function(user) {
                    MD_ADMIN_SETTINGS.user = user;
                    $rootScope.user = user;
                }, function() {
                    // redirect to the login page if auto-login fails
                    $state.loginRedirectUrl = '/dashboards' + $location.url();
                    $state.go('login');
                    //window.location = $state.href('login');
                });
            }
            break;
        case 'LOGGED_IN':
            // occurs almost simultaneously with API_UP message, only display if we didn't hit API_UP state
            if (previous.status && previous.status !== 'API_UP')
                message = Translate.trSync('dashboards.v3.app.connectivityRestored');
            if (!MD_ADMIN_SETTINGS.user) {
                // user logged in elsewhere
                User.current().$promise.then(function(user) {
                    MD_ADMIN_SETTINGS.user = user;
                    $rootScope.user = user;
                });
            }
            break;
        }
        $rootScope.user = MD_ADMIN_SETTINGS.user;

        if (message) {
            var toast = $mdToast.simple()
                .textContent(message)
                .action('OK')
                .highlightAction(true)
                .position('bottom center')
                .hideDelay(hideDelay);
            $mdToast.show(toast);
        }
    });

}]);

// Get an injector for the maServices app and use the JsonStore service to retrieve the
// custom user menu items from the REST api prior to bootstrapping the main application.
// This is so the states can be added to the stateProvider in the config block for the
// main application. If the states are added after the main app runs then the user may
// not navigate directly to one of their custom states on startup
var servicesInjector = angular.injector(['maServices'], true);
var User = servicesInjector.get('User');
var JsonStore = servicesInjector.get('JsonStore');
var $q = servicesInjector.get('$q');
var $http = servicesInjector.get('$http');

var userAndUserSettingsPromise = User.current().$promise.then(null, function() {
    return User.autoLogin();
}).then(function(user) {
    var userMenuPromise = JsonStore.get({xid: 'custom-user-menu'}).$promise.then(function(store) {
        return store.jsonData;
    }, angular.noop);
    
    var userDashboardSettingsPromise = JsonStore.get({xid: 'dashboard-settings'}).$promise.then(function(store) {
        return store.jsonData;
    }, angular.noop);
    
    return $q.all([user, userMenuPromise, userDashboardSettingsPromise]);
}, angular.noop).then(function(data) {
    return {
        user: data && data[0],
        userMenu: data && data[1],
        userDashboardSettings: data && data[2]
    }
});

var dashboardSettingsPromise = $http({
    method: 'GET',
    url: require.toUrl('./dashboardSettings.json')
}).then(function(data) {
    return data.data;
}, angular.noop);

$q.all([userAndUserSettingsPromise, dashboardSettingsPromise]).then(function(data) {
    var mdAdminSettings = {};
    mdAdminSettings.user = data[0].user;
    var userMenu = data[0].userMenu;
    var userDashboardSettings = data[0].userDashboardSettings;
    var dashboardSettings = data[1];
    
    if (dashboardSettings) {
        angular.merge(mdAdminSettings, dashboardSettings);
    }
    if (userDashboardSettings) {
        angular.merge(mdAdminSettings, userDashboardSettings);
    }
    if (userMenu) {
        mdAdminSettings.customMenuItems = userMenu.menuItems;
        mdAdminSettings.defaultUrl = userMenu.defaultUrl;
    }
    
    servicesInjector.get('$rootScope').$destroy();
    mdAdminApp.constant('MD_ADMIN_SETTINGS', mdAdminSettings);
    angular.element(document).ready(function() {
        angular.bootstrap(document.documentElement, ['mdAdminApp'], {strictDi: true});
    });
});

}); // define
