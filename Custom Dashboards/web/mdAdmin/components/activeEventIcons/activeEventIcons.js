/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var activeEventIconsController = function activeEventIconsController(Events, eventsEventManager) {
    var $ctrl = this;
    
    Events.getActiveSummary().$promise.then(
        function(data) {
            // console.log('success', data);
            $ctrl.eventsSummary = data;
            $ctrl.events = {};
            
            $ctrl.eventsSummary.forEach(function(item, index, array) {
                $ctrl.events[item.level] = item
            });
            
            // console.log($ctrl.events);
            
        },
        function(data) {
            console.log('error', data);
        }
    );
    
    eventsEventManager.subscribe(function(msg) {
        console.log(msg);
    });
};

activeEventIconsController.$inject = ['Events', 'eventsEventManager'];

return {
    controller: activeEventIconsController,
    templateUrl: require.toUrl('./activeEventIcons.html')
};

}); // define