/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

var watchListBuilder = function watchListBuilder(Point, cssInjector, WatchList, Util, MD_ADMIN_SETTINGS, $stateParams, $state, $mdDialog, Translate, $timeout) {
    var $ctrl = this;
    
    $ctrl.newWatchlist = function newWatchlist(name) {
        $ctrl.selectedWatchlist = null;
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
        $ctrl.editWatchlist(watchlist);
        if ($ctrl.form)
            $ctrl.form.$setPristine();
    };
    
    var defaultTotal = $ctrl.total = '\u221E';
    $ctrl.selectedPoints = [];
    $ctrl.staticSelected = [];
    $ctrl.allPoints = [];
    $ctrl.tableQuery = {
        limit: 10,
        page: 1,
        order: 'name'
    };
    $ctrl.staticTableQuery = {
        limit: 10,
        page: 1
    };

    $ctrl.queryProperties = [
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
    
    $ctrl.selectedTab = 0;
    $ctrl.nextStep = function() {
        $ctrl.selectedTab++;
    };
    $ctrl.prevStep = function() {
        $ctrl.selectedTab--;
    };
    
    $ctrl.save = function save() {
        var saveMethod = $ctrl.watchlist.isNew ? '$save' : '$update';
        $ctrl.watchlist[saveMethod]().then(function(wl) {
            $ctrl.selectedWatchlist = wl;
            $ctrl.watchlistSelected();
            
            var found = false
            for (var i = 0; i < $ctrl.watchlists.length; i++) {
                if ($ctrl.watchlists[i].xid === wl.xid) {
                    $ctrl.watchlists.splice(i, 1, wl);
                    found = true;
                    break;
                }
            }
            if (!found) {
                $ctrl.watchlists.push(wl);
            }
            
            $ctrl.form.$setPristine();
        });
    };
    
    $ctrl.deleteWatchlist = function deleteWatchlist(event) {
        
        var confirm = $mdDialog.confirm()
            .title(Translate.trSync('dashboards.v3.app.areYouSure'))
            .textContent(Translate.trSync('dashboards.v3.app.confirmDeleteWatchlist'))
            .ariaLabel(Translate.trSync('dashboards.v3.app.areYouSure'))
            .targetEvent(event)
            .ok(Translate.trSync('common.ok'))
            .cancel(Translate.trSync('common.cancel'));
        
        $mdDialog.show(confirm).then(function() {
            $ctrl.watchlist.$delete().then(function(wl) {
                $ctrl.newWatchlist();
                for (var i = 0; i < $ctrl.watchlists.length; i++) {
                    if ($ctrl.watchlists[i].xid === wl.xid) {
                        $ctrl.watchlists.splice(i, 1);
                        break;
                    }
                }
            });
        });
    };
    
    $ctrl.$onInit = function() {
        $ctrl.refreshWatchlists();
        if ($stateParams.watchListXid) {
            $ctrl.getWatchlist($stateParams.watchListXid);
        } else {
            $ctrl.newWatchlist();
        }
    };
    
    $ctrl.getWatchlist = function getWatchlist(xid) {
        WatchList.get({xid: xid}).$promise.then(function(wl) {
            var user = MD_ADMIN_SETTINGS.user;
            if (wl.username !== user.username && !user.hasPermission(wl.writePermission)) {
                throw 'no edit permission';
            }
            $ctrl.selectedWatchlist = wl;
            $ctrl.watchlistSelected();
        }, function() {
            $ctrl.newWatchlist();
        });
    };
    
    $ctrl.refreshWatchlists = function refreshWatchlists() {
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
            $ctrl.watchlists = filtered;
        });
    };

    $ctrl.watchlistSelected = function watchlistSelected() {
        if ($ctrl.selectedWatchlist) {
            $ctrl.editWatchlist(angular.copy($ctrl.selectedWatchlist));
            $ctrl.form.$setPristine();
        } else if (!$ctrl.watchlist || !$ctrl.watchlist.isNew) {
            $ctrl.newWatchlist();
        }
    };
    
    $ctrl.editWatchlist = function editWatchlist(watchlist) {
        $ctrl.watchlist = watchlist;
        $state.go('.', {watchListXid: watchlist.isNew ? null : watchlist.xid}, {location: 'replace', notify: false});
        if (!watchlist.isNew && watchlist.type === 'static') {
            watchlist.$getPoints().then(function() {
                $ctrl.selectedPoints = watchlist.points;
                $ctrl.resetSort();
                $ctrl.sortAndLimit();
            });
        } else {
            $ctrl.selectedPoints = [];
        }
        $ctrl.staticSelected = [];
        $ctrl.parseQuery();
        $ctrl.doPointQuery();
    };

    $ctrl.doPointQuery = function doPointQuery() {
        // makes the table disappear when paginating
        //$ctrl.allPoints = [];
        
        var queryObj = new query.Query(angular.copy($ctrl.tableQuery.rql));
        if (queryObj.name !== 'and') {
            if (!queryObj.args.length) {
                queryObj = new query.Query();
            } else {
                queryObj = new query.Query({name: 'and', args: [queryObj]});
            }
        }
        queryObj = queryObj.sort($ctrl.tableQuery.order);
        queryObj = queryObj.limit($ctrl.tableQuery.limit, ($ctrl.tableQuery.page - 1) * $ctrl.tableQuery.limit);
        
        $ctrl.queryPromise = Point.query({rqlQuery: queryObj.toString()})
        .$promise.then(function(allPoints) {
            $ctrl.total = allPoints.$total;
            
            // set the points to an empty array and then to the actual points so that each row is destroyed and re-created
            // this ensures that checkboxes are preserved for selected points
            $ctrl.allPoints = [];
            $timeout(function() {
                $ctrl.allPoints = allPoints;
            }, 0);
            
        }, function() {
            $ctrl.allPoints = [];
        });
    };

    $ctrl.parseQuery = function parseQuery() {
        var queryObj = new query.Query($ctrl.watchlist.query);
        if (queryObj.cache && queryObj.cache.sort && queryObj.cache.sort.length) {
            $ctrl.tableQuery.order = queryObj.cache.sort[0];
        }
        for (var i = 0; i < queryObj.args.length; i++) {
            var arg = queryObj.args[i];
            if (arg.name === 'limit' || arg.name === 'sort') {
                queryObj.args.splice(i--, 1);
            }
        }
        $ctrl.tableQuery.rql = queryObj;
    };
    
    $ctrl.queryChanged = function queryChanged() {
        $ctrl.parseQuery();
        $ctrl.doPointQuery();
    };
    
    $ctrl.resetSort = function() {
        delete $ctrl.staticTableQuery.order;
    };
    
    $ctrl.sortAndLimit = function() {
        var order = $ctrl.staticTableQuery.order;
        if (order) {
            var desc = false;
            if (desc = order.indexOf('-') === 0 || order.indexOf('+') === 0) {
                order = order.substring(1);
            }
            $ctrl.watchlist.points.sort(function(a, b) {
                if (a[order] > b[order]) return desc ? -1 : 1;
                if (a[order] < b[order]) return desc ? 1 : -1;
                return 0;
            });
        }
        
        var limit = $ctrl.staticTableQuery.limit;
        var start = $ctrl.staticTableQuery.start = ($ctrl.staticTableQuery.page - 1) * $ctrl.staticTableQuery.limit
        $ctrl.pointsInView = $ctrl.watchlist.points.slice(start, start + limit);
    };
    
    $ctrl.dragAndDrop = function(event, ui) {
        $ctrl.resetSort();
        var from = $ctrl.staticTableQuery.start + ui.item.sortable.index;
        var to = $ctrl.staticTableQuery.start + ui.item.sortable.dropindex;
        
        var item = $ctrl.watchlist.points[from];
        $ctrl.watchlist.points.splice(from, 1);
        $ctrl.watchlist.points.splice(to, 0, item);
    };
    
    $ctrl.removeFromWatchlist = function() {
        var map = {};
        for (var i = 0; i < $ctrl.staticSelected.length; i++) {
            map[$ctrl.staticSelected[i].xid] = true;
        }
        for (i = 0; i < $ctrl.watchlist.points.length; i++) {
            if (map[$ctrl.watchlist.points[i].xid]) {
                $ctrl.watchlist.points.splice(i--, 1);
            }
        }
        $ctrl.staticSelected = [];
        $ctrl.sortAndLimit();
    };
};

watchListBuilder.$inject = ['Point', 'cssInjector', 'WatchList', 'Util', 'MD_ADMIN_SETTINGS', '$stateParams', '$state', '$mdDialog', 'Translate', '$timeout'];

return {
    controller: watchListBuilder,
    templateUrl: require.toUrl('./watchListBuilder.html')
};

}); // define
