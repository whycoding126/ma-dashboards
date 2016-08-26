/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var pointHierarchyFolder = function pointHierarchyFolder() {
    this.$onInit = function() {
    };
    
    this.checkboxChanged = function checkboxChanged() {
        this.browserCtrl.folderCheckChanged(this.folder);
    }
};

pointHierarchyFolder.$inject = [];

return {
    controller: pointHierarchyFolder,
    templateUrl: require.toUrl('./pointHierarchyFolder.html'),
    bindings: {
        folder: '<'
    },
    require: {
        browserCtrl: '^^maPointHierarchyBrowser'
    }
};

}); // define
