/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

watchListPageController.$inject = ['$mdMedia', 'WatchList', 'Translate', '$stateParams', '$state', 'PointHierarchy', 'mdAdminSettings', 'DateBar'];
function watchListPageController($mdMedia, WatchList, Translate, $stateParams, $state, PointHierarchy, mdAdminSettings, DateBar) {
    this.watchList = null;
    this.selectWatchList = null;
    this.dataSource = null;
    this.deviceName = null;
    this.hierarchyFolders = [];
    this.settings = mdAdminSettings;
    this.dateBar = DateBar;
    
    this.selectFirstWatchList = false;
    if ($stateParams.watchListXid) {
        this.listType = 'watchLists';
    } else if ($stateParams.dataSourceXid) {
        this.listType = 'dataSources';
    } else if ($stateParams.deviceName) {
        this.listType = 'deviceNames';
    } else if ($stateParams.hierarchyFolderId) {
        this.listType = 'hierarchy';
        PointHierarchy.get({id: $stateParams.hierarchyFolderId}).$promise.then(function(folder) {
            var folders = [];
            PointHierarchy.walkHierarchy(folder, function(folder, parent, index) {
                folders.push(folder);
            });
            this.hierarchyFolders = folders;
            this.hierarchyChanged();
        }.bind(this));
    } else {
        if ($mdMedia('gt-md')) {
            this.selectFirstWatchList = true;
        }
        this.listType = 'watchLists';
    }
    
    this.$mdMedia = $mdMedia;
    
    this.watchListChanged = function watchListChanged() {
        this.watchList = this.selectWatchList;
        
        // clear other selections
        this.dataSource = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
    };
    
    this.dataSourceChanged = function dataSourceChanged() {
        if (this.dataSource) {
            var dsQuery = new query.Query()
                .eq('dataSourceXid', this.dataSource.xid)
                .sort('name')
                .limit(200);

            var watchList = new WatchList();
            watchList.isNew = true;
            watchList.type = 'query';
            watchList.name = Translate.trSync('dashboards.v3.app.dataSourceX', [this.dataSource.name]);
            watchList.query = dsQuery.toString();
            watchList.$getPoints();
            this.watchList = watchList;
        } else {
            this.watchList = null;
        }

        // clear other selections
        this.selectWatchList = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
    };
    
    this.deviceNameChanged = function deviceNameChanged() {
        if (this.deviceName) {
            var dnQuery = new query.Query()
                .eq('deviceName', this.deviceName)
                .sort('name')
                .limit(200);

            var watchList = new WatchList();
            watchList.isNew = true;
            watchList.type = 'query';
            watchList.name = Translate.trSync('dashboards.v3.app.deviceNameX', [this.deviceName]);
            watchList.query = dnQuery.toString();
            watchList.$getPoints();
            this.watchList = watchList;
        } else {
            this.watchList = null;
        }
        
        // clear other selections
        this.selectWatchList = null;
        this.dataSource = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
    };
    
    this.hierarchyChanged = function hierarchyChanged() {
        if (this.hierarchyFolders && this.hierarchyFolders.length) {
            var watchList = new WatchList();
            watchList.isNew = true;
            watchList.type = 'hierarchy';
            watchList.name = Translate.trSync('dashboards.v3.app.hierarchyFolderX', [this.hierarchyFolders[0].name]);
            watchList.hierarchyFolders = this.hierarchyFolders;
            watchList.$getPoints();
            this.watchList = watchList;
            $stateParams.hierarchyFolderId = this.hierarchyFolders[0].id;
        } else {
            this.watchList = null;
            $stateParams.hierarchyFolderId = null;
        }
        
        $state.go('.', $stateParams, {location: 'replace', notify: false});

        // clear other selections
        this.selectWatchList = null;
        this.dataSource = null;
        this.deviceName = null;
    };
    
    this.clear = function clear() {
        this.watchList = null;

        // clear selections
        this.selectWatchList = null;
        this.dataSource = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
    };
    
    this.editWatchList = function editWatchList(watchList) {
        $state.go('dashboard.settings.watchListBuilder', {watchListXid: watchList ? watchList.xid : null});
    };
    
    this.updateQuery = function updateQuery() {
        var filterText = '*' + this.filter + '*';
        var rqlQuery = new query.Query({name: 'or', args: []});
        rqlQuery.push(new query.Query({name: 'like', args: ['name', filterText]}));
        this.dataSourceQuery = rqlQuery.toString();
        rqlQuery.push(new query.Query({name: 'like', args: ['username', filterText]}));
        this.watchListQuery = rqlQuery.toString();
    };
}

return {
    controller: watchListPageController,
    templateUrl: require.toUrl('./watchListPage.html'),
    bindings: {
        watchList: '<?'
    }
};

}); // define