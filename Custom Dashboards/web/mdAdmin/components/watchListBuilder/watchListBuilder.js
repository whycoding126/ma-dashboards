/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var watchListBuilder = function watchListBuilder(Point, cssInjector, WatchList, Util, MD_ADMIN_SETTINGS, $stateParams, $state) {
    this.newWatchlist = function newWatchlist(name) {
        this.selectedWatchlist = null;
        var watchlist = new WatchList();
        watchlist.isNew = true;
        watchlist.name = name || 'New watchlist';
        watchlist.xid = 'wl_' + Util.uuid();
        watchlist.points = [];
        watchlist.username = MD_ADMIN_SETTINGS.user.username;
        watchlist.type = 'static';
        watchlist.readPermission = 'user';
        watchlist.editPermission = 'edit-watchlists';
        watchlist.query = {
            limit: 10,
            page: 1,
            order: 'name',
            rql: ''
        };
        watchlist.params = {
            limit: 10,
            page: 1,
            order: 'name'
        };
        this.editWatchlist(watchlist);
    };

    this.queryProperties = [
        {
            label: 'Point name',
            value: 'name'
        },
        {
            label: 'Device name',
            value: 'deviceName'
        },
        {
            label: 'Data source name',
            value: 'dataSourceName'
        },
        {
            label: 'XID',
            value: 'xid'
        }
    ];
    
    this.save = function save() {
        this.watchlist.$save().then(function(wl) {
            this.selectedWatchlist = wl;
            this.watchlistSelected();
            
            var found = false
            for (var i = 0; i < this.watchlists.length; i++) {
                if (this.watchlists[i].xid === wl.xid) {
                    this.watchlists.splice(i, 1, wl);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.watchlists.push(wl);
            }
        }.bind(this));
    };
    
    this.deleteWatchlist = function deleteWatchlist() {
        this.watchlist.$delete().then(function(wl) {
            this.newWatchlist();
            for (var i = 0; i < this.watchlists.length; i++) {
                if (this.watchlists[i].xid === wl.xid) {
                    this.watchlists.splice(i, 1);
                    break;
                }
            }
        }.bind(this));
    };
    
    this.$onInit = function() {
        this.refreshWatchlists();
        if ($stateParams.watchListXid) {
            this.getWatchlist($stateParams.watchListXid);
        } else {
            this.newWatchlist();
        }
    };
    
    this.getWatchlist = function getWatchlist(xid) {
        WatchList.get({xid: xid}).$promise.then(function(wl) {
            var user = MD_ADMIN_SETTINGS.user;
            if (wl.username !== user.username && !user.hasPermission(wl.writePermission)) {
                throw 'no edit permission';
            }
            this.selectedWatchlist = wl;
            this.watchlistSelected();
        }.bind(this), function() {
            this.newWatchlist();
        }.bind(this));
    };
    
    this.refreshWatchlists = function refreshWatchlists() {
        WatchList.query().then(function(watchlists) {
            var filtered = [];
            var user = MD_ADMIN_SETTINGS.user;
            for (var i = 0; i < watchlists.length; i++) {
                var wl = watchlists[i];
                if (wl.username === user.username || user.hasPermission(wl.writePermission)) {
                    filtered.push(wl);
                }
            }
            this.watchlists = filtered;
        }.bind(this));
    };

    this.watchlistSelected = function watchlistSelected() {
        if (this.selectedWatchlist) {
            this.editWatchlist(angular.copy(this.selectedWatchlist));
        } else {
            this.newWatchlist();
        }
    };
    
    this.editWatchlist = function editWatchlist(watchlist) {
        this.watchlist = watchlist;
        $state.go('.', {watchListXid: watchlist.isNew ? null : watchlist.xid}, {location: 'replace', notify: false});
        this.doPointQuery();
    };

    this.doPointQuery = function doPointQuery() {
        this.allPoints = [];
        this.queryPromise = Point.objQuery({
            query: this.watchlist.query.rql,
            sort: this.watchlist.query.order,
            limit: this.watchlist.query.limit,
            start: (this.watchlist.query.page - 1) * this.watchlist.query.limit
        }).$promise.then(function(allPoints) {
            this.allPoints = allPoints;
        }.bind(this));
    }.bind(this);
};

watchListBuilder.$inject = ['Point', 'cssInjector', 'WatchList', 'Util', 'MD_ADMIN_SETTINGS', '$stateParams', '$state'];

return {
    controller: watchListBuilder,
    templateUrl: require.toUrl('./watchListBuilder.html')
};

}); // define
