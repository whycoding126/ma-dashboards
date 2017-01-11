/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

UserSelectController.$inject = ['User'];
function UserSelectController(User) {
    this.User = User;
}

UserSelectController.prototype.$onInit = function() {
    this.users = this.User.query();
};

UserSelectController.prototype.selectUser = function(user, $event) {
    this.ngModelCtrl.$setViewValue(user, $event);
};

return {
    controller: UserSelectController,
    templateUrl: require.toUrl('./userSelect.html'),
    require: {
        'ngModelCtrl': 'ngModel'
    },
    bindings: {
    }
};

}); // define
