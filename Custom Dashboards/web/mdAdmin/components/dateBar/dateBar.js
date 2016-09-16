/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

return {
    templateUrl: require.toUrl('./dateBar.html'),
    controller: ['MD_ADMIN_SETTINGS', dateBarController]
};

function dateBarController(MD_ADMIN_SETTINGS) {
    this.params = MD_ADMIN_SETTINGS.dateBar;
    
    this.$onInit = function() {
    };
}

}); // define
