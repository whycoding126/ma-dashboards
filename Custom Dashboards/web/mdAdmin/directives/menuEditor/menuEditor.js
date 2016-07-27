/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuEditor = function(Menu, $mdDialog, Translate, $mdMedia) {
    return {
        scope: {},
        templateUrl: require.toUrl('./menuEditor.html'),
        link: function($scope, $element) {
            var menuItems;
            
            $scope.menuEditor = {};
            
            Menu.getMenu().then(function(storeObject) {
                $scope.storeObject = storeObject;
                menuItems = storeObject.jsonData.menuItems;
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
                        menuItems = storeObject.jsonData.menuItems;
                    });
                });
            }
            
            $scope.editItem = function editItem(event, origItem, parent, menuItemArray, menuItemIndex) {
                var item;
                if (!origItem) {
                    item = {
                        isNew: true,
                        name: 'dashboard.',
                        url: '/'
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
                        menuItems: menuItems
                    },
                    controller: function editItemController($scope, $mdDialog) {
                        $scope.cancel = function cancel() {
                            $mdDialog.cancel();
                        };
                        $scope.save = function save() {
                            if ($scope.menuItemEditForm.$valid) {
                                $mdDialog.hide();
                            }
                        };
                        $scope['delete'] = function() {
                            menuItemArray.splice(menuItemIndex, 1);
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
                        menuItemArray.splice(menuItemIndex, 1);
                    }
                    if (parent && !parent.children.length) {
                        delete parent.children;
                    }
                    
                    // copy item properties back onto original item
                    if (!isNew) {
                        angular.copy(item, origItem);
                        item = origItem;
                    }
                    
                    // add item back into parents children or into the menuItems array
                    if (newParent) {
                        if (!newParent.children)
                            newParent.children = [];
                        newParent.children.push(item);
                    } else {
                        menuItems.push(item);
                    }
                });
            }
            
            $scope.saveMenu = function saveMenu() {
                $scope.storeObject.$save();
            }
        }
    };
};

menuEditor.$inject = ['Menu', '$mdDialog', 'Translate', '$mdMedia'];

return menuEditor;

}); // define
