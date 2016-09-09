/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var activeEventIconsController = function activeEventIconsController(Events) {
    this.events = Events.getActiveSummary;
};

activeEventIconsController.$inject = ['Events'];

return {
    controller: activeEventIconsController,
    templateUrl: require.toUrl('./activeEventIcons.html')
};

}); // define