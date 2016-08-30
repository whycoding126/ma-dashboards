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
            alwaysShowSelect: '=?',
            selectFirst: '=?'
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var xid = $stateParams.watchListXid || this.watchListXid;
            if (xid) {
                this.watchList = WatchList.get({xid: xid});
                this.watchList.$promise.then(function(watchList) {
                    this.setWatchList(watchList);
                }.bind(this));
            }
            if (!xid || this.alwaysShowSelect) {
                this.showSelect = true;
                this.queryPromise = WatchList.query().then(function(watchLists) {
                    this.watchLists = watchLists;
                    
                    if (!this.watchList && (angular.isUndefined(this.selectFirst) || this.selectFirst) && watchLists.length) {
                        this.setWatchList(watchLists[0]);
                    }
                    
                    return watchLists;
                }.bind(this));
            }
            
            this.onChange = function() {
                setWatchList(this.watchList);
            };
            
            this.onOpen = function() {
                return this.queryPromise;
            }
            
            this.setWatchList = function(watchList) {
                if (!watchList) return;
                this.watchList = watchList;
                this.points = watchList.points;
                $state.go('.', {watchListXid: this.watchList.xid}, {location: 'replace', notify: false});
            };
        }]
    };
}

watchLists.$inject = ['WatchList', '$stateParams', '$injector', '$state'];

return watchLists;

}); // define
