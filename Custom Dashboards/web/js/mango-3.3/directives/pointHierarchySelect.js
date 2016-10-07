/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

pointHierarchySelect.$inject = ['$injector'];
function pointHierarchySelect($injector) {
    return {
        restrict: 'E',
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./pointHierarchySelect-md.html');
            }
            return require.toUrl('./pointHierarchySelect.html');
        },
        controllerAs: '$ctrl',
        bindToController: true,
        replace: true,
        scope: {
            path: '<?',
            subfolders: '<?',
            subfoldersOnly: '<?'
        },
        controller: pointHierarchyController
    };
}

pointHierarchyController.$inject = ['$scope', '$element', '$attrs', 'PointHierarchy'];
function pointHierarchyController($scope, $element, $attrs, PointHierarchy) {
    this.$onChanges = function(changes) {
        this.doQuery();
    };
    
    this.doQuery = function doQuery() {
        var subfoldersOnly = !!this.subfoldersOnly;
        var subfolders = subfoldersOnly || (angular.isUndefined($attrs.subfolders) ? true : !!this.subfolders);
        var path = typeof this.path === 'string' ? this.path.split(',') : this.path;
        if (!path) {
            path = [];
        }
        
        var hierarchy = path.length ?
                PointHierarchy.byPath({path: path, subfolders: subfolders}) :
                PointHierarchy.getRoot({subfolders: subfolders});

        var folderList = this.folderList = [];
        this.queryPromise = hierarchy.$promise.then(function(folder) {
            PointHierarchy.walkHierarchy(folder, function(subFolder) {
                if (subfoldersOnly && subFolder === folder) return;
                folderList.push(subFolder);
            });
        });
    };
    
    this.onOpen = function onOpen() {
        return this.queryPromise;
    };
}

return pointHierarchySelect;

}); // define
