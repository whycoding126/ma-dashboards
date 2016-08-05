/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var SUBSCRIPTION_TYPES = ['add', 'update'];

var jsonStoreMenuController = function jsonStoreMenuController($scope, Menu, jsonStoreEventManager, CUSTOM_USER_MENU_XID) {
    this.$onInit = function() {
        Menu.getMenu().then(function(storeObject) {
            this.menuItems = storeObject.jsonData.menuItems;
        }.bind(this));
        
        jsonStoreEventManager.subscribe(CUSTOM_USER_MENU_XID, SUBSCRIPTION_TYPES, this.updateHandler);
    };
    
    this.$onDestroy = function() {
        jsonStoreEventManager.unsubscribe(CUSTOM_USER_MENU_XID, SUBSCRIPTION_TYPES, this.updateHandler);
    };
    
    this.updateHandler = function updateHandler(event, payload) {
        $scope.$apply(function() {
            this.menuItems = payload.object.jsonData.menuItems;
        }.bind(this));
    };
};

jsonStoreMenuController.$inject = ['$scope', 'Menu', 'jsonStoreEventManager', 'CUSTOM_USER_MENU_XID'];

return {
    controller: jsonStoreMenuController,
    template: '<dashboard-menu menu-items="$ctrl.menuItems"></dashboard-menu>'
};

}); // define
