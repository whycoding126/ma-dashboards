/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['./services/Point',
        './services/User',
        './services/PointEventManagerFactory',
        './services/Translate',
        './services/mangoHttpInterceptor',
        './services/JsonStore',
        './services/JsonStoreEventManagerFactory',
        './services/Util',
        './services/mangoWatchdog',
        './services/EventManager',
        'angular',
        'angular-resource'
], function(Point, User, PointEventManagerFactory, Translate, mangoHttpInterceptor, JsonStore, JsonStoreEventManagerFactory, Util,
		mangoWatchdog, EventManager, angular) {
'use strict';

var maServices = angular.module('maServices', ['ngResource']);

maServices.factory('Point', Point);
maServices.factory('User', User);
maServices.factory('pointEventManager', PointEventManagerFactory);
maServices.factory('Translate', Translate);
maServices.factory('mangoHttpInterceptor', mangoHttpInterceptor);
maServices.factory('JsonStore', JsonStore);
maServices.factory('jsonStoreEventManager', JsonStoreEventManagerFactory);
maServices.factory('Util', Util);
maServices.factory('mangoWatchdog', mangoWatchdog);
maServices.factory('EventManager', EventManager);

maServices.constant('mangoBaseUrl', '');
maServices.constant('mangoTimeout', 30000);
maServices.constant('mangoWatchdogTimeout', 60000);

maServices.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('mangoHttpInterceptor');
}]);

maServices.run(['$rootScope', 'mangoWatchdog', function($rootScope, mangoWatchdog) {
	$rootScope.mangoWatchdog = mangoWatchdog;
	mangoWatchdog.reset();
}]);

return maServices;

}); // require
