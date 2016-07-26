/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuEditor = function(Menu, PAGES, $mdDialog, Translate) {
    return {
        scope: {},
        templateUrl: require.toUrl('./menuEditor.html'),
        link: function($scope, $element) {
            var pages;
            
            Menu.getMenu().then(function(storeObject) {
                $scope.storeObject = storeObject;
                pages = storeObject.jsonData.pages;
            });
            
            $scope.restoreDefaultMenu = function restoreDefaultMenu(event) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.trSync('dashboards.v3.app.areYouSure'))
                    .textContent(Translate.trSync('dashboards.v3.app.confirmRestoreDefaultMenu'))
                    .ariaLabel(Translate.trSync('dashboards.v3.app.areYouSure'))
                    .targetEvent(event)
                    .ok(Translate.trSync('common.ok'))
                    .cancel(Translate.trSync('common.cancel'));
                
                $mdDialog.show(confirm).then(function() {
                    $scope.storeObject = Menu.getDefaultMenu();
                    $scope.storeObject.$save();
                });
            }
            
            $scope.editItem = function editItem(event, origItem) {
                var item;
                if (!origItem) {
                    item = {
                        isNew: true
                    };
                } else {
                    item = angular.copy(origItem);
                }
                
                $mdDialog.show({
                    bindToController: true,
                    controllerAs: 'editCtrl',
                    locals: {
                        item: item
                    },
                    controller: function editItemController($scope, $mdDialog) {
                        $scope.cancel = function cancel() {
                            $mdDialog.cancel();
                        };
                        $scope.save = function save() {
                            $mdDialog.hide();
                        };
                    },
                    templateUrl: require.toUrl('./editItem.html'),
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: true
                }).then(function() {
                    if (item.isNew) {
                        delete item.isNew;
                        pages.push(item);
                    } else {
                        angular.copy(item, origItem);
                    }
                });
            }
            
            $scope.saveMenu = function saveMenu() {
                $scope.storeObject.$save();
            }
        }
    };
};

menuEditor.$inject = ['Menu', 'PAGES', '$mdDialog', 'Translate'];

return menuEditor;

}); // define
