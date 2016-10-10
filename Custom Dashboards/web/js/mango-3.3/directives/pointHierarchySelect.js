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
            subfoldersOnly: '<?',
            nameMatches: '@?',
            replaceName: '@?',
            uniqueNames: '<?',
            showClear: '<?'
        },
        controller: pointHierarchyController
    };
}

pointHierarchyController.$inject = ['$attrs', 'PointHierarchy'];
function pointHierarchyController($attrs, PointHierarchy) {
    this.$onChanges = function(changes) {
        this.doQuery();
    };
    
    this.doQuery = function doQuery() {
        var subfoldersOnly = !!this.subfoldersOnly;
        var subfolders = subfoldersOnly || (angular.isUndefined($attrs.subfolders) ? true : !!this.subfolders);
        var path;
        if (!this.path) {
            path = [];
        } else {
            path = typeof this.path === 'string' ? this.path.split(',') : this.path;
        }
        
        var hierarchy = path.length ?
                PointHierarchy.byPath({path: path, subfolders: subfolders}) :
                PointHierarchy.getRoot({subfolders: subfolders});

        this.folderList = [];
        var seenNames = {};
        var matcher = this.nameMatches && new RegExp(this.nameMatches, 'gi');
        this.displayProp = this.replaceName ? 'replacedName' : 'name';
        
        this.queryPromise = hierarchy.$promise.then(function(folder) {
            PointHierarchy.walkHierarchy(folder, function(subFolder) {
                if (subfoldersOnly && subFolder === folder) return;
                if (matcher) {
                    subFolder.matches = matcher.exec(subFolder.name);
                    if (this.replaceName && subFolder.matches) {
                        subFolder.replacedName = subFolder.name.replace(matcher, this.replaceName);
                    }
                }
                var displayName = subFolder[this.displayProp];
                if ((!matcher || subFolder.matches) && !(this.uniqueNames && seenNames[displayName])) {
                    this.folderList.push(subFolder);
                    seenNames[displayName] = true;
                }
            }.bind(this));
        }.bind(this));
    };
    
    this.onOpen = function onOpen() {
        return this.queryPromise;
    };
}

return pointHierarchySelect;

}); // define
