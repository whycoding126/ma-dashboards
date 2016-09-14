/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

return {
    controller: ['$mdMedia', 'WatchList', 'Translate',
                 function watchListPageController($mdMedia, WatchList, Translate) {
        this.navItem = 'watchLists';
        this.$mdMedia = $mdMedia;
        
        this.watchListChanged = function watchListChanged(watchList) {
            if (watchList) {
                this.watchList = watchList;
                this.hierarchyFolders = [];
            }
        };
        
        this.hierarchyChanged = function() {
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
            this.listCtrl.setWatchList(null);
        };
        
        this.clear = function clearWatchList() {
            this.watchList = null;
            
            this.listCtrl.setWatchList(null);
            this.hierarchyFolders = [];
        };
    }],
    templateUrl: require.toUrl('./watchListPage.html'),
    bindings: {
        watchList: '<?'
    }
};

}); // define