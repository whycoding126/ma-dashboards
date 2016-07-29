/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

function MenuEditorFactory(Menu, $mdDialog, Translate, Page, mangoState, $q) {

    function MenuEditor() {
    }
    
    MenuEditor.prototype.editMenuItem = function editMenuItem(event, origItem, parent, store, save) {
        var storePromise = store ? $q.when(store) : Menu.getMenu();
        return storePromise.then(function(menuStore) {
            var menuItems = menuStore.jsonData.menuItems;
            
            if (typeof origItem === 'string') {
                Menu.eachMenuItem(menuItems, null, function(m, p) {
                    if (m.xid === origItem) {
                        origItem = m;
                        parent = p;
                        return true;
                    }
                });
            }

            var item = origItem ? angular.copy(origItem) : {
                isNew: true,
                name: 'dashboard.',
                url: '/',
                linkToPage: true
            };
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
                    menuItems: menuItems
                },
                controller: function editItemController($scope, $mdDialog) {
                    Page.getPages().then(function(store) {
                        $scope.pages = store.jsonData.pages;
                    });
                    
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
                        mangoState.addState(item);
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
