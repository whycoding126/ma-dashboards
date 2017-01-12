/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

pageView.$inject = ['Page', 'jsonStoreEventManager', 'User'];
function pageView (Page, jsonStoreEventManager, User) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];

    return {
        scope: true,
        templateUrl: require.toUrl('./pageView.html'),
        link: function($scope, $element, $attrs) {
            $scope.User = User;
            Page.loadPage($attrs.xid).then(function(page) {
                $scope.page = page;
                $scope.markup = page.jsonData.markup;
            });

            jsonStoreEventManager.smartSubscribe($scope, $attrs.xid, SUBSCRIPTION_TYPES, function updateHandler(event, payload) {
                $scope.markup = payload.object.jsonData.markup;
            });
        }
    };
};

return pageView;

}); // define
