/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var dashboardMenuController = function dashboardMenuController(User, $rootScope) {
    this.$onInit = function() {
        this.user = $rootScope.user;
    };
    
    this.menuOpened = function menuOpened(toggleCtrl) {
        var submenu = null;
        var ctrl = toggleCtrl;
        while(ctrl) {
            if (ctrl.item.submenu) {
                submenu = ctrl.item;
                break;
            }
            ctrl = ctrl.parentToggle;
        }
        this.openSubmenu = submenu;
        
        this.openMenu = toggleCtrl.item;
        this.openMenuLevel = toggleCtrl.menuLevel + 1;
    };
    
    this.menuClosed = function menuOpened(toggleCtrl) {
        if (this.openSubmenu && toggleCtrl.item.name === this.openSubmenu.name) {
            delete this.openSubmenu;
        }
        if (this.openMenu && this.openMenu.name.indexOf(toggleCtrl.item.name) === 0) {
            this.openMenu = toggleCtrl.parentToggle ? toggleCtrl.parentToggle.item : null;
            this.openMenuLevel = toggleCtrl.menuLevel;
        }
    };
};

dashboardMenuController.$inject = ['User', '$rootScope'];

return {
    controller: dashboardMenuController,
    templateUrl: require.toUrl('./dashboardMenu.html'),
    bindings: {
        menuItems: '<'
    }
};

}); // define
