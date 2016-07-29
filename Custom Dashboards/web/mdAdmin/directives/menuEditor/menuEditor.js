/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuEditor = function(Menu, $mdDialog, Translate, $mdMedia, Page, mangoState, MenuEditor) {
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
            };
            
            $scope.editItem = MenuEditor.editMenuItem;
            
            $scope.saveMenu = function saveMenu() {
                $scope.storeObject.$save().then(function(store) {
                    mangoState.addStates(store.jsonData.menuItems);
                });
            }
        }
    };
};

menuEditor.$inject = ['Menu', '$mdDialog', 'Translate', '$mdMedia', 'Page', 'mangoState', 'MenuEditor'];

return menuEditor;

}); // define
