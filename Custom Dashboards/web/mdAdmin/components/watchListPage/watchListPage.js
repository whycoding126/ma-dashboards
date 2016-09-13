/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

return {
    controller: ['$mdMedia', function watchListPageController($mdMedia) {
        this.navItem = 'watchLists';
        this.$mdMedia = $mdMedia;
        this.clearWatchList = function clearWatchList() {
            this.listCtrl.setWatchList(null);
        };
    }],
    templateUrl: require.toUrl('./watchListPage.html'),
    bindings: {
        watchList: '<?'
    }
};

}); // define