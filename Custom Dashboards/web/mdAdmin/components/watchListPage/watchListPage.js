/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

return {
    controller: ['$mdMedia', 'WatchList', 'Translate', '$stateParams',
                 function watchListPageController($mdMedia, WatchList, Translate, $stateParams) {
        this.watchList = null;
        this.selectWatchList = null;
        this.dataSource = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        this.selectFirstWatchList = false;
        if ($stateParams.watchListXid) {
            this.listType = 'watchLists';
        } else if ($stateParams.dataSourceXid) {
            this.listType = 'dataSources';
        } else if ($stateParams.deviceName) {
            this.listType = 'deviceNames';
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
        };
        
        this.dataSourceChanged = function dataSourceChanged() {
            var watchList = new WatchList();
            watchList.type = 'query';
            watchList.name = Translate.trSync('dashboards.v3.app.dataSource', [this.dataSource.name]);
            watchList.query = 'dataSourceXid=' + this.dataSource.xid;
            watchList.$getPoints();
            this.watchList = watchList;
            
            this.selectWatchList = null;
            this.deviceName = null;
            this.hierarchyFolders = [];
        };
        
        this.deviceNameChanged = function deviceNameChanged() {
            var watchList = new WatchList();
            watchList.type = 'query';
            watchList.name = Translate.trSync('dashboards.v3.app.deviceName', [this.deviceName]);
            watchList.query = 'deviceName=' + this.deviceName;
            watchList.$getPoints();
            this.watchList = watchList;
            
            // clear other selections
            this.selectWatchList = null;
            this.dataSource = null;
            this.hierarchyFolders = [];
        };
        
        this.hierarchyChanged = function hierarchyChanged() {
            if (this.hierarchyFolders && this.hierarchyFolders.length) {
                var watchList = new WatchList();
                watchList.type = 'hierarchy';
                watchList.name = Translate.trSync('dashboards.v3.app.hierarchyFolder', [this.hierarchyFolders[0].name]);
                watchList.hierarchyFolders = this.hierarchyFolders;
                watchList.$getPoints();
                this.watchList = watchList;
            } else {
                this.watchList = null;
            }

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
        };
    }],
    templateUrl: require.toUrl('./watchListPage.html'),
    bindings: {
        watchList: '<?'
    }
};

}); // define