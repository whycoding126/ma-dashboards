/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function MenuFactory(MENU_ITEMS, CUSTOM_MENU_ITEMS, JsonStore, CUSTOM_USER_MENU_XID, $q) {

    var firstRun = true;
    
    function Menu() {
    }
    
    Menu.prototype.getMenu = function getMenu() {
        // custom menu items are retrieved on bootstrap, don't get them twice on app startup
        // after first run use the standard JsonStore http request
        if (firstRun) {
            firstRun = false;
            var menuStore = this.getDefaultMenu();
            if (CUSTOM_MENU_ITEMS) {
                menuStore.jsonData.menuItems = CUSTOM_MENU_ITEMS;
            }
            return $q.when(menuStore);
        }
        return JsonStore.get({xid: CUSTOM_USER_MENU_XID}).$promise.then(null, function() {
            // no menu exists in JsonStore, create one
            return this.getDefaultMenu();
        }.bind(this));
    };
    
    Menu.prototype.getDefaultMenu = function getDefaultMenu() {
        var storeObject = new JsonStore();
        storeObject.xid = CUSTOM_USER_MENU_XID;
        storeObject.name = CUSTOM_USER_MENU_XID;
        storeObject.jsonData = {};
        storeObject.editPermission = 'edit-menus';
        storeObject.readPermission = 'user';
        
        var menuItems = angular.copy(MENU_ITEMS);
        this.eachMenuItem(menuItems, null, function(menuItem) {
            menuItem.builtIn = true;
        });
        storeObject.jsonData.menuItems = menuItems;
        
        return storeObject;
    };
    
    Menu.prototype.eachMenuItem = function eachMenuItem(menuItems, parent, fn) {
        if (!menuItems) return;
        for (var i = 0; i < menuItems.length; i++) {
            var menuItem = menuItems[i];
            var result = fn(menuItem, parent, menuItems, i);
            if (result) return result;
            this.eachMenuItem(menuItem.children, menuItem, fn);
        }
    }

    return new Menu();
}

MenuFactory.$inject = ['MENU_ITEMS', 'CUSTOM_MENU_ITEMS', 'JsonStore', 'CUSTOM_USER_MENU_XID', '$q'];
return MenuFactory;

}); // define
