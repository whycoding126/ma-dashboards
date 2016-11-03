/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['./services/Point',
        './services/PointHierarchy',
        './services/User',
        './services/PointEventManagerFactory',
        './services/Translate',
        './services/mangoHttpInterceptor',
        './services/JsonStore',
        './services/JsonStoreEventManagerFactory',
        './services/Util',
        './services/mangoWatchdog',
        './services/EventManager',
        './services/cssInjector',
        './services/DataSource',
        './services/DeviceName',
        './services/WatchList',
        './services/WatchListEventManager',
        './services/rqlParamSerializer',
        './services/UserNotes',
        './services/eventsEventManagerFactory',
        './services/events',
        './services/DynamicItems',
        './services/pointValuesFactory',
        'angular',
        'angular-resource',
        'angular-local-storage'
], function(Point, PointHierarchy, User, PointEventManagerFactory, Translate, mangoHttpInterceptor, JsonStore,
        JsonStoreEventManagerFactory, Util, mangoWatchdog, EventManager, cssInjector, DataSourceFactory, DeviceNameFactory,
        WatchListFactory, WatchListEventManagerFactory, rqlParamSerializer, UserNotes, eventsEventManagerFactory, events,
        DynamicItems, pointValuesFactory, angular) {
'use strict';
/**
 * @ngdoc overview
 * @name maServices
 *
 *
 * @description
 * The maServices module handles loading of services and providers that make API calls to the mango backend.
 *
 *
**/
var maServices = angular.module('maServices', ['ngResource', 'LocalStorageModule']);

maServices.factory('Point', Point);
maServices.factory('PointHierarchy', PointHierarchy);
maServices.factory('User', User);
maServices.factory('pointEventManager', PointEventManagerFactory);
maServices.factory('Translate', Translate);
maServices.factory('mangoHttpInterceptor', mangoHttpInterceptor);
maServices.factory('JsonStore', JsonStore);
maServices.factory('jsonStoreEventManager', JsonStoreEventManagerFactory);
maServices.factory('Util', Util);
maServices.factory('mangoWatchdog', mangoWatchdog);
maServices.factory('EventManager', EventManager);
maServices.factory('cssInjector', cssInjector);
maServices.factory('DataSource', DataSourceFactory);
maServices.factory('DeviceName', DeviceNameFactory);
maServices.factory('WatchList', WatchListFactory);
maServices.factory('WatchListEventManager', WatchListEventManagerFactory);
maServices.factory('rqlParamSerializer', rqlParamSerializer);
maServices.factory('UserNotes', UserNotes);
maServices.factory('eventsEventManager', eventsEventManagerFactory);
maServices.factory('Events', events);
maServices.factory('DynamicItems', DynamicItems);
maServices.factory('pointValues', pointValuesFactory);

maServices.constant('mangoBaseUrl', '');
maServices.constant('mangoTimeout', 30000);
maServices.constant('mangoWatchdogTimeout', 30000);
maServices.constant('mangoReconnectDelay', 15000);
maServices.constant('mangoDefaultDateFormat', 'll LTS');
maServices.constant('mangoDefaultDateOnlyFormat', 'l');
maServices.constant('mangoDefaultTimeFormat', 'LT');

maServices.config(['localStorageServiceProvider', '$httpProvider', '$provide', function(localStorageServiceProvider, $httpProvider, $provide) {
    localStorageServiceProvider
        .setPrefix('maServices')
        .setStorageCookieDomain(window.location.hostname === 'localhost' ? '' : window.location.host)
        .setNotify(false, false);
    
    $httpProvider.defaults.paramSerializer = 'rqlParamSerializer';

    $provide.decorator('$q', ['$delegate', function($delegate) {
        function decoratePromise(promise) {
            var then = promise.then;
            promise.then = function() {
                var nextPromise = then.apply(this, arguments);
                if (typeof promise.cancel === 'function') {
                    nextPromise.cancel = promise.cancel;
                }
                return decoratePromise(nextPromise);
            };
            
            promise.setCancel = function setCancel(cancel) {
                this.cancel = cancel;
                return this;
            };
            
            return promise;
        }

        var defer = $delegate.defer;
        var when = $delegate.when;
        var reject = $delegate.reject;
        var all = $delegate.all;
        var race = $delegate.race;
        
        $delegate.defer = function() {
            var deferred = defer.apply(this, arguments);
            decoratePromise(deferred.promise);
            return deferred;
        };
        $delegate.when = function() {
            var p = when.apply(this, arguments);
            return decoratePromise(p);
        };
        $delegate.reject = function() {
            var p = reject.apply(this, arguments);
            return decoratePromise(p);
        };
        $delegate.all = function() {
            var p = all.apply(this, arguments);
            p.cancel = cancelAll.apply(null, arguments);
            return decoratePromise(p);
        };
        $delegate.race = function() {
            var p = race.apply(this, arguments);
            p.cancel = cancelAll.apply(null, arguments);
            return decoratePromise(p);
        };
        
        function cancelAll() {
            var promises = Array.prototype.slice.apply(arguments);
            return function() {
                for (var i = 0; i < promises.length; i++) {
                    if (typeof promises[i].cancel === 'function') {
                        promises[i].cancel.apply(promises[i], arguments);
                    }
                }
            }
        }

        return $delegate;
    }]);
}]);

return maServices;

}); // require
