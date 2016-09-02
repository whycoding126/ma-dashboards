/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

var watchListBuilder = function watchListBuilder(Point, cssInjector, WatchList, Util, MD_ADMIN_SETTINGS, $stateParams, $state, $mdDialog, Translate, $timeout) {
    this.newWatchlist = function newWatchlist(name) {
        this.selectedWatchlist = null;
        var watchlist = new WatchList();
        watchlist.isNew = true;
        watchlist.name = name;
        watchlist.xid = Util.uuid();
        watchlist.points = [];
        watchlist.username = MD_ADMIN_SETTINGS.user.username;
        watchlist.type = 'static';
        watchlist.readPermission = 'user';
        watchlist.editPermission = 'edit-watchlists';
        watchlist.query = 'sort(deviceName,name)&limit(200)';
        this.editWatchlist(watchlist);
        if (this.form)
            this.form.$setPristine();
    };
    
    var defaultTotal = this.total = '\u221E';
    this.selectedPoints = [];
    this.allPoints = [];
    this.tableQuery = {
        limit: 10,
        page: 1,
        order: 'name'
    };
    this.staticTableQuery = {
        limit: 10,
        page: 1,
        order: 'name'
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
    
    this.selectedTab = 0;
    this.nextStep = function() {
        this.selectedTab++;
    };
    this.prevStep = function() {
        this.selectedTab--;
    };
    
    this.save = function save() {
        var saveMethod = this.watchlist.isNew ? '$save' : '$update';
        this.watchlist[saveMethod]().then(function(wl) {
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
            
            this.form.$setPristine();
        }.bind(this));
    };
    
    this.deleteWatchlist = function deleteWatchlist(event) {
        
        var confirm = $mdDialog.confirm()
            .title(Translate.trSync('dashboards.v3.app.areYouSure'))
            .textContent(Translate.trSync('dashboards.v3.app.confirmDeleteWatchlist'))
            .ariaLabel(Translate.trSync('dashboards.v3.app.areYouSure'))
            .targetEvent(event)
            .ok(Translate.trSync('common.ok'))
            .cancel(Translate.trSync('common.cancel'));
        
        $mdDialog.show(confirm).then(function() {
            this.watchlist.$delete().then(function(wl) {
                this.newWatchlist();
                for (var i = 0; i < this.watchlists.length; i++) {
                    if (this.watchlists[i].xid === wl.xid) {
                        this.watchlists.splice(i, 1);
                        break;
                    }
                }
            }.bind(this));
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
        WatchList.query({rqlQuery: 'sort(name)'}).$promise.then(function(watchlists) {
            var filtered = [];
            var user = MD_ADMIN_SETTINGS.user;
            for (var i = 0; i < watchlists.length; i++) {
                var wl = watchlists[i];
                if (wl.username === user.username || user.hasPermission(wl.writePermission)) {
                    wl.points = [];
                    filtered.push(wl);
                }
            }
            this.watchlists = filtered;
        }.bind(this));
    };

    this.watchlistSelected = function watchlistSelected() {
        if (this.selectedWatchlist) {
            this.editWatchlist(angular.copy(this.selectedWatchlist));
            this.form.$setPristine();
        } else if (!this.watchlist || !this.watchlist.isNew) {
            this.newWatchlist();
        }
    };
    
    this.editWatchlist = function editWatchlist(watchlist) {
        this.watchlist = watchlist;
        $state.go('.', {watchListXid: watchlist.isNew ? null : watchlist.xid}, {location: 'replace', notify: false});
        if (!watchlist.isNew && watchlist.type === 'static') {
            watchlist.$getPoints().then(function() {
                this.selectedPoints = watchlist.points;
            }.bind(this));
        } else {
            this.selectedPoints = [];
        }
        this.parseQuery();
        this.doPointQuery();
    };

    this.doPointQuery = function doPointQuery() {
        // makes the table disappear when paginating
        //this.allPoints = [];
        
        var queryObj = new query.Query(angular.copy(this.tableQuery.rql));
        if (queryObj.name !== 'and') {
            if (!queryObj.args.length) {
                queryObj = new query.Query();
            } else {
                queryObj = new query.Query({name: 'and', args: [queryObj]});
            }
        }
        queryObj = queryObj.sort(this.tableQuery.order);
        queryObj = queryObj.limit(this.tableQuery.limit, (this.tableQuery.page - 1) * this.tableQuery.limit);
        
        this.queryPromise = Point.query({rqlQuery: queryObj.toString()})
        .$promise.then(function(allPoints) {
            this.total = allPoints.$total;
            
            // set the points to an empty array and then to the actual points so that each row is destroyed and re-created
            // this ensures that checkboxes are preserved for selected points
            this.allPoints = [];
            $timeout(function() {
                this.allPoints = allPoints;
            }.bind(this), 0);
            
        }.bind(this), function() {
            this.allPoints = [];
        }.bind(this));
    }.bind(this);

    this.parseQuery = function parseQuery() {
        var queryObj = new query.Query(this.watchlist.query);
        if (queryObj.cache && queryObj.cache.sort && queryObj.cache.sort.length) {
            this.tableQuery.order = queryObj.cache.sort[0];
        }
        for (var i = 0; i < queryObj.args.length; i++) {
            var arg = queryObj.args[i];
            if (arg.name === 'limit' || arg.name === 'sort') {
                queryObj.args.splice(i--, 1);
            }
        }
        this.tableQuery.rql = queryObj;
    };
    
    this.queryChanged = function queryChanged() {
        this.parseQuery();
        this.doPointQuery();
    };
};

watchListBuilder.$inject = ['Point', 'cssInjector', 'WatchList', 'Util', 'MD_ADMIN_SETTINGS', '$stateParams', '$state', '$mdDialog', 'Translate', '$timeout'];

return {
    controller: watchListBuilder,
    templateUrl: require.toUrl('./watchListBuilder.html')
};

}); // define
