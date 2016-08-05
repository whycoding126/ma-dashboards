/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuLinkController = function menuLinkController($state) {
    this.followLink = function() {
        $state.go(this.item.name);
    }
};

menuLinkController.$inject = ['$state'];

return {
    controller: menuLinkController,
    templateUrl: require.toUrl('./menuLink.html'),
    bindings: {
        item: '<menuItem'
    }
};

}); // define
