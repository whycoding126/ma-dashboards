/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuEditor = function(Menu, PAGES, $mdDialog, Translate, $mdMedia) {
    return {
        scope: {},
        templateUrl: require.toUrl('./menuEditor.html'),
        link: function($scope, $element) {
            var pages;
            
            $scope.menuEditor = {};
            
            Menu.getMenu().then(function(storeObject) {
                $scope.storeObject = storeObject;
                pages = storeObject.jsonData.pages;
            });
            
            $scope.$mdMedia = $mdMedia;
            
            $scope.restoreDefaultMenu = function restoreDefaultMenu(event) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.trSync('dashboards.v3.app.areYouSure'))
                    .textContent(Translate.trSync('dashboards.v3.app.confirmRestoreDefaultMenu'))
                    .ariaLabel(Translate.trSync('dashboards.v3.app.areYouSure'))
                    .targetEvent(event)
                    .ok(Translate.trSync('common.ok'))
                    .cancel(Translate.trSync('common.cancel'));
                
                $mdDialog.show(confirm).then(function() {
                    Menu.getDefaultMenu().$save().then(function(storeObject) {
                        $scope.storeObject = storeObject;
                        pages = storeObject.jsonData.pages;
                    });
                });
            }
            
            $scope.editItem = function editItem(event, origItem, parent, pageArray, pageIndex) {
                var item;
                if (!origItem) {
                    item = {
                        isNew: true
                    };
                } else {
                    item = angular.copy(origItem);
                }
                item.parent = parent;
                
                $mdDialog.show({
                    bindToController: true,
                    controllerAs: 'editCtrl',
                    locals: {
                        item: item,
                        pages: pages
                    },
                    controller: function editItemController($scope, $mdDialog) {
                        $scope.cancel = function cancel() {
                            $mdDialog.cancel();
                        };
                        $scope.save = function save() {
                            $mdDialog.hide();
                        };
                        $scope['delete'] = function() {
                            pageArray.splice(pageIndex, 1);
                            if (parent && !parent.children.length) {
                                delete parent.children;
                            }
                            $mdDialog.cancel();
                        };
                        $scope.parentChanged = function() {
                            if (this.item.isNew) {
                                this.item.name = this.item.parent.name + '.'
                            }
                        }.bind(this);
                    },
                    templateUrl: require.toUrl('./editItem.html'),
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: true
                }).then(function() {
                    var newParent = item.parent;
                    var isNew = item.isNew;
                    delete item.parent;
                    delete item.isNew;
                    
                    // remove item from old parents children array
                    if (newParent !== parent) {
                        pageArray.splice(pageIndex, 1);
                    }
                    if (parent && !parent.children.length) {
                        delete parent.children;
                    }
                    
                    // copy item properties back onto original item
                    if (!isNew) {
                        angular.copy(item, origItem);
                        item = origItem;
                    }
                    
                    // add item back into parents children or into the pages array
                    if (newParent) {
                        if (!newParent.children)
                            newParent.children = [];
                        newParent.children.push(item);
                    } else {
                        pages.push(item);
                    }
                });
            }
            
            $scope.saveMenu = function saveMenu() {
                $scope.storeObject.$save();
            }
        }
    };
};

menuEditor.$inject = ['Menu', 'PAGES', '$mdDialog', 'Translate', '$mdMedia'];

return menuEditor;

}); // define
