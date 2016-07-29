/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var pageView = function(Page, jsonStoreEventManager) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];

    return {
        scope: {
            xid: '@'
        },
        template: '<div live-preview="markup"></div>',
        link: function($scope, $element) {
            Page.loadPage($scope.xid).then(function(store) {
                $scope.markup = store.jsonData.markup;
            });

            jsonStoreEventManager.smartSubscribe($scope, $scope.xid, SUBSCRIPTION_TYPES, function updateHandler(event, payload) {
                $scope.markup = payload.object.jsonData.markup;
            });
        }
    };
};

pageView.$inject = ['Page', 'jsonStoreEventManager'];

return pageView;

}); // define
