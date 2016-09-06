/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var pointHierarchyBrowser = function pointHierarchyBrowser(PointHierarchy) {
    this.$onInit = function() {
    };

    this.$onChanges = function(changes) {
        if (changes.path) {
            var resourceObj = this.path && this.path.length ?
                    PointHierarchy.byPath({path: this.path, subfolders: true}) :
                    PointHierarchy.getRoot({subfolders: true});
            resourceObj.$promise.then(function(hierarchy) {
                walkHierarchy(hierarchy, function(folder, parent, index) {
                    folder.checked = false;
                });
                this.hierarchy = hierarchy;
            }.bind(this))
        }
    };
    
    this.folderClicked = function folderClicked($event, folder) {
        this.onFolderClicked({$event: $event, folder: folder});
    };
    
    function walkHierarchy(folder, fn, parent, index) {
        fn(folder, parent, index);
        for (var i = 0; i < folder.subfolders.length; i++) {
            walkHierarchy(folder.subfolders[i], fn, folder, i);
        }
    }
};

pointHierarchyBrowser.$inject = ['PointHierarchy'];

return {
    controller: pointHierarchyBrowser,
    templateUrl: require.toUrl('./pointHierarchyBrowser.html'),
    bindings: {
        path: '<',
        onFolderClicked: '&',
        expanded: '<'
    }
};

}); // define
