/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function MenuFactory(mangoState, MENU_ITEMS, JsonStore, CUSTOM_USER_MENU_XID) {

    function Menu() {
    }
    
    Menu.prototype.getMenu = function getMenu() {
        return JsonStore.get({xid: CUSTOM_USER_MENU_XID}).$promise.then(null, function() {
            // no menu exists in JsonStore, create one
            return this.getDefaultMenu();
        }.bind(this)).then(function(storeObject) {
            var userMenus = storeObject.jsonData.menuItems;
            mangoState.addStates(userMenus);
            return storeObject;
        });
    };
    
    Menu.prototype.getDefaultMenu = function getDefaultMenu() {
        var storeObject = new JsonStore();
        storeObject.xid = CUSTOM_USER_MENU_XID;
        storeObject.name = CUSTOM_USER_MENU_XID;
        storeObject.jsonData = {};
        storeObject.editPermission = 'edit-menus';
        storeObject.readPermission = 'user';
        
        var menuItems = angular.copy(MENU_ITEMS);
        eachMenuItem(menuItems, null, function(menuItem) {
            menuItem.builtIn = true;
        });
        storeObject.jsonData.menuItems = menuItems;
        
        return storeObject;
    };
    
    function eachMenuItem(menuItems, parent, fn) {
        angular.forEach(menuItems, function(menuItem, index) {
            fn(menuItem);
            eachMenuItem(menuItem.children, menuItem, fn);
        });
    }

    return new Menu();
}

MenuFactory.$inject = ['mangoState', 'MENU_ITEMS', 'JsonStore', 'CUSTOM_USER_MENU_XID'];
return MenuFactory;

}); // define
