/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuLinkController = function menuLinkController($state) {
    this.$onInit = function() {
        this.menuLevel = this.parentToggle ? this.parentToggle.menuLevel + 1 : 1;
    }
    
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
    },
    require: {
        parentToggle: '?^^menuToggle'
    }
};

}); // define
