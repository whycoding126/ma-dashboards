/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var pointHierarchyBrowser = function pointHierarchyBrowser(PointHierarchy, Point) {

    this.$onInit = function() {
        this.ngModelCtrl.$render = this.render;
    };

    this.$onChanges = function(changes) {
        if (changes.path) {
            var resourceObj = this.path && this.path.length ?
                    PointHierarchy.byPath({path: this.path, subfolders: true}) :
                    PointHierarchy.getRoot({subfolders: true});
            resourceObj.$promise.then(function(hierarchy) {
                this.hierarchy = hierarchy;
                this.render();
            }.bind(this))
        }
    };

    /**
     * Takes the $viewValue and checks the folders accordingly
     */
    this.render = function render() {
        if (!this.hierarchy) return;
        
        // $viewValue is an array of folders/points
        var viewArray = this.ngModelCtrl.$viewValue;
        if (angular.isUndefined(viewArray)) {
            return;
        }
        
        var selectedMap = {};
        var idProp = this.selectPoints ? 'xid' : 'id';
        for (var i = 0; i < viewArray.length; i++) {
            selectedMap[viewArray[i][idProp]] = viewArray[i];
        }
        
        this.walkHierarchy(this.hierarchy, function(folder, parent, index) {
            if (this.selectPoints) {
                var selectedPointsInThisFolder = [];
                for (i = 0; i < folder.points.length; i++) {
                    var pt = folder.points[i];
                    var isSelected = !!selectedMap[pt.xid];
                    if (isSelected) {
                        selectedPointsInThisFolder.push(pt);
                    }
                }
                if (selectedPointsInThisFolder.length === folder.points.length) {
                    folder.checked = true;
                    delete folder.partialPoints;
                } else if (selectedPointsInThisFolder.length === 0) {
                    folder.checked = false;
                    delete folder.partialPoints;
                } else {
                    folder.checked = true;
                    folder.partialPoints = selectedPointsInThisFolder;
                }
            } else {
                folder.checked = !!selectedMap[folder.id];
            }
        }.bind(this));
    }.bind(this);

    /**
     * Triggered when an checkbox changes and the $viewValue should be updated, and hence the $modelValue via the parser
     */
    this.folderCheckChanged = function folderCheckChanged(changedFolder) {
        var viewArray = [];
        // TODO track and re-add points in $modelValue which are not in any folder
        
        var changedFolderChildren = {};
        if (this.selectSubfolders) {
            this.walkHierarchy(changedFolder, function(folder, parent, index) {
                folder.checked = changedFolder.checked;
                changedFolderChildren[folder.id] = true;
            }.bind(this));
        }
        
        this.walkHierarchy(this.hierarchy, function(folder, parent, index) {
            if (this.selectOneFolder) {
                if (!changedFolderChildren[folder.id]) {
                    folder.checked = false;
                }
            }
            
            if (this.selectPoints) {
                if (folder.partialPoints && folder.partialPoints.length) {
                    Array.prototype.splice.apply(viewArray, [viewArray.length, 0].concat(folder.partialPoints));
                } else if (folder.checked && folder.points.length) {
                    Array.prototype.splice.apply(viewArray, [viewArray.length, 0].concat(folder.points));
                }
            } else if (folder.checked) {
                viewArray.push(folder);
            }
        }.bind(this));

        this.ngModelCtrl.$setViewValue(viewArray);
    };
    
    this.walkHierarchy = function walkHierarchy(folder, fn, parent, index) {
        fn(folder, parent, index);
        for (var i = 0; i < folder.subfolders.length; i++) {
            this.walkHierarchy(folder.subfolders[i], fn, folder, i);
        }
    }.bind(this);
};

pointHierarchyBrowser.$inject = ['PointHierarchy', 'Point'];

return {
    controller: pointHierarchyBrowser,
    templateUrl: require.toUrl('./pointHierarchyBrowser.html'),
    require: {
        'ngModelCtrl': 'ngModel'
    },
    bindings: {
        path: '<',
        expanded: '<',
        selectPoints: '<',
        selectSubfolders: '<',
        selectOneFolder: '<'
    }
};

}); // define
