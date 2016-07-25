/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var maMenu = function(Menu, jsonStoreEventManager, CUSTOM_USER_PAGES_XID, User) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];

    return {
        scope: {},
        templateUrl: require.toUrl('./menu.html'),
        link: function($scope, $element) {
            $scope.user = User.current();
            
            Menu.getMenu().then(function(storeObject) {
                $scope.pages = storeObject.jsonData.pages;
            });
            
            var updateHandler = function updateHandler(event, payload) {
                $scope.$apply(function() {
                    $scope.pages = payload.object.jsonData.pages;
                });
            }
            
            jsonStoreEventManager.subscribe(CUSTOM_USER_PAGES_XID, SUBSCRIPTION_TYPES, updateHandler);
            $scope.$on('$destroy', function() {
                jsonStoreEventManager.unsubscribe(CUSTOM_USER_PAGES_XID, SUBSCRIPTION_TYPES, updateHandler);
            });
        }
    };
};

maMenu.$inject = ['Menu', 'jsonStoreEventManager', 'CUSTOM_USER_PAGES_XID', 'User'];

return maMenu;

}); // define
