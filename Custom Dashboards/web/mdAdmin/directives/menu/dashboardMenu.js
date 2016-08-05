/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var dashboardMenuController = function dashboardMenuController(User) {
    this.$onInit = function() {
        this.user = User.current();
    };
    
    this.menuOpened = function menuOpened(menuItem) {
        this.openMenu = menuItem;
    };
};

dashboardMenuController.$inject = ['User'];

return {
    controller: dashboardMenuController,
    templateUrl: require.toUrl('./dashboardMenu.html'),
    bindings: {
        menuItems: '<'
    }
};

}); // define
