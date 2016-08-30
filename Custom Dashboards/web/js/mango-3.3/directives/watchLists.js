/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

function watchLists(WatchList, $stateParams, $injector, $state) {
    return {
        restrict: 'E',
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./watchLists-md.html');
            }
            return require.toUrl('./watchLists.html');
        },
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            points: '=?',
            watchList: '=?',
            watchListXid: '@',
            alwaysShowSelect: '=?'
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var xid = $stateParams.watchListXid || this.watchListXid;
            if (xid) {
                this.watchList = WatchList.get({xid: xid});
                this.watchList.$promise.then(function(watchList) {
                    this.points = watchList.points;
                }.bind(this));
            }
            if (!xid || this.alwaysShowSelect) {
                this.showSelect = true;
                this.queryPromise = WatchList.query().then(function(watchLists) {
                    this.watchLists = watchLists;
                    return watchLists;
                }.bind(this));
            }
            
            this.onChange = function() {
                if (this.watchList) {
                    this.points = this.watchList.points;
                    $state.go('.', {watchListXid: this.watchList.xid}, {location: 'replace', notify: false});
                }
            };
            
            this.onOpen = function() {
                return this.queryPromise;
            }
        }]
    };
}

watchLists.$inject = ['WatchList', '$stateParams', '$injector', '$state'];

return watchLists;

}); // define
