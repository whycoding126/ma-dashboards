/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var pointHierarchyFolder = function pointHierarchyFolder() {
    this.$onInit = function() {
        this.open = this.browserCtrl.expanded;
    };
    
    this.folderClicked = function folderClicked($event) {
        this.open = !this.open;
    };
    
    this.checkboxChanged = function checkboxChanged() {
        delete this.folder.partialPoints;
        this.browserCtrl.folderCheckChanged(this.folder);
    };
};

pointHierarchyFolder.$inject = [];

return {
    controller: pointHierarchyFolder,
    templateUrl: require.toUrl('./pointHierarchyFolder.html'),
    bindings: {
        folder: '<',
        parent: '<'
    },
    require: {
        browserCtrl: '^^maPointHierarchyBrowser'
    }
};

}); // define
