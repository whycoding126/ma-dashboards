/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

UserEditorController.$inject = [];
function UserEditorController() {
}

UserEditorController.prototype.$onChanges = function(changes) {
    //console.log(changes);
};

return {
    controller: UserEditorController,
    templateUrl: require.toUrl('./userEditor.html'),
    bindings: {
        user: '<?'
    }
};

}); // define
