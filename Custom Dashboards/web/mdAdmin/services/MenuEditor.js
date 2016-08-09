/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

function MenuEditorFactory(Menu, $mdDialog, Translate, Page, mangoState, $q) {

    function MenuEditor() {
    }
    
    MenuEditor.prototype.editMenuItem = function editMenuItem(event, origItem, parent, store, save, searchBy) {
        var storePromise = store ? $q.when(store) : Menu.getMenu();
        return storePromise.then(function(menuStore) {
            var menuItems = menuStore.jsonData.menuItems;
            
            // build flat menu item array so we can choose any item in dropdown
            var flatMenuItems = [];
            var flatMenuMap = [];
            Menu.eachMenuItem(menuItems, null, function(menuItem) {
                flatMenuItems.push(menuItem);
                flatMenuMap[menuItem.name] = true;
            });
            
            // search for the item
            if (searchBy) {
                Menu.eachMenuItem(menuItems, null, function(m, p) {
                    if (m[searchBy] === origItem) {
                        origItem = m;
                        parent = p;
                        return true;
                    }
                });
            }

            var item;
            if (origItem && typeof origItem === 'object') {
                // editing an item that was provided or searched for and found
                item = angular.copy(origItem);
            } else {
                // editing a new item
                item = {
                    isNew: true,
                    name: parent ? parent.name + '.' : 'dashboard.',
                    url: '/',
                    pageXid: null,
                    linkToPage: true
                };
                // item we were searching for was not found
                // set the property we were looking for on the new item
                if (searchBy) {
                    item[searchBy] = origItem;
                    origItem = null;
                }
            }
            item.parent = parent;
            
            return $mdDialog.show({
                templateUrl: require.toUrl('./MenuEditorDialog.html'),
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: true,
                bindToController: true,
                controllerAs: 'editCtrl',
                locals: {
                    item: item,
                    menuItems: flatMenuItems
                },
                controller: function editItemController($scope, $mdDialog) {
                    Page.getPages().then(function(store) {
                        $scope.pages = store.jsonData.pages;
                    });
                    
                    $scope.checkStateExists = function(name) {
                        $scope.menuItemEditForm.stateName.$setValidity('stateExists', !flatMenuMap[name]);
                    }
                    
                    $scope.cancel = function cancel() {
                        $mdDialog.cancel();
                    };
                    $scope.save = function save() {
                        if ($scope.menuItemEditForm.$valid) {
                            $mdDialog.hide();
                        }
                    };
                    $scope['delete'] = function() {
                        item.deleted = true;
                        $mdDialog.hide();
                    };
                    $scope.parentChanged = function() {
                        if (this.item.isNew) {
                            this.item.name = this.item.parent.name + '.'
                        }
                    }.bind(this);
                }
            }).then(function() {
                var newParent = item.parent;
                var isNew = item.isNew;
                delete item.parent;
                delete item.isNew;
                
                if (!isNew && (item.deleted || parent !== newParent)) {
                    var array = parent ? parent.children : menuItems;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].name === item.name) {
                            array.splice(i, 1);
                            break;
                        }
                    }
                    if (parent && !parent.children.length) {
                        delete parent.children;
                    }
                    if (item.deleted) {
                        return;
                    }
                }

                // copy item properties back onto original item
                if (!isNew) {
                    angular.copy(item, origItem);
                    item = origItem;
                }

                // add item back into parents children or into the menuItems array
                if (isNew || parent !== newParent) {
                    if (newParent) {
                        if (!newParent.children)
                            newParent.children = [];
                        newParent.children.push(item);
                    } else {
                        menuItems.push(item);
                    }
                }
            }).then(function() {
                if (save)
                    return menuStore.$save().then(function(store) {
                        if (!item.deleted)
                            mangoState.addStates([item]);
                        return store;
                    });
                else
                    return menuStore;
            });
        });
    };

    return new MenuEditor();
};

MenuEditorFactory.$inject = ['Menu', '$mdDialog', 'Translate', 'Page', 'mangoState', '$q'];
return MenuEditorFactory;

}); // define
