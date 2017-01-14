/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire / Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var pageViewController = function pageViewController($scope, Page, jsonStoreEventManager, User) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];
    
    var $ctrl = this;
    $ctrl.User = User;

    $ctrl.$onChanges = function(changes) {
        Page.loadPage($ctrl.xid).then(function(page) {
            $ctrl.page = page;
            $ctrl.markup = page.jsonData.markup;
        });

        jsonStoreEventManager.smartSubscribe($scope, $ctrl.xid, SUBSCRIPTION_TYPES, function updateHandler(event, payload) {
            $ctrl.markup = payload.object.jsonData.markup;
        });
    };
};

pageViewController.$inject = ['$scope', 'Page', 'jsonStoreEventManager', 'User'];

return {
    controller: pageViewController,
    bindings: {
        xid: '@'
    },
    templateUrl: require.toUrl('./pageView.html')
};

}); // define