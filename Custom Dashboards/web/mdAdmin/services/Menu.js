/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function MenuFactory(mangoState, PAGES, JsonStore, CUSTOM_USER_PAGES_XID) {
    var SUBSCRIPTION_TYPES = ['update'];

    function Menu() {
    }
    
    Menu.prototype.getMenu = function getMenu() {
        return JsonStore.get({xid: CUSTOM_USER_PAGES_XID}).$promise.then(null, function() {
            // no menu exists in JsonStore, create one
            return this.getDefaultMenu();
        }.bind(this)).then(function(storeObject) {
            var userPages = storeObject.jsonData.pages;
            mangoState.addStates(userPages);
            return storeObject;
        });
    };
    
    Menu.prototype.getDefaultMenu = function getDefaultMenu() {
        var storeObject = new JsonStore();
        storeObject.xid = CUSTOM_USER_PAGES_XID;
        storeObject.name = CUSTOM_USER_PAGES_XID;
        storeObject.jsonData = {};
        storeObject.editPermission = '';
        storeObject.readPermission = 'user';
        
        var pages = angular.copy(PAGES);
        for (var i = 0; i < pages.length; i++) {
            pages[i].builtIn = true;
        }
        storeObject.jsonData.pages = pages;
        
        return storeObject;
    };

    return new Menu();
}

MenuFactory.$inject = ['mangoState', 'PAGES', 'JsonStore', 'CUSTOM_USER_PAGES_XID'];
return MenuFactory;

}); // define
