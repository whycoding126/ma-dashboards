/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var watchListBuilder = function watchListBuilder(Point, cssInjector, WatchList, Util, MD_ADMIN_SETTINGS) {
    this.newWatchlist = function newWatchlist(name) {
        var watchlist = new WatchList();
        watchlist.name = name || 'New watchlist';
        watchlist.xid = 'wl_' + Util.uuid();
        watchlist.points = [];
        watchlist.username = MD_ADMIN_SETTINGS.user.username;
        watchlist.type = 'static';
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
        this.watchlist = watchlist;
        this.watchListChanged();
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
    
    this.$onInit = function() {
        this.refreshWatchlists();
        this.newWatchlist();
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
    
    this.watchListChanged = function watchListChanged() {
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

watchListBuilder.$inject = ['Point', 'cssInjector', 'WatchList', 'Util', 'MD_ADMIN_SETTINGS'];

return {
    controller: watchListBuilder,
    templateUrl: require.toUrl('./watchListBuilder.html')
};

}); // define
