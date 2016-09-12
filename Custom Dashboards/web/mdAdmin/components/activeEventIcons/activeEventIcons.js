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
            
            eventsEventManager.subscribe(function(msg) {
                console.log(msg);
                
                if (msg.status === 'OK' && msg.payload.type === 'RAISED') {
                    increment(msg.payload.event);
                }
                
            });
            
            var increment = function(payloadEvent) {
                console.log(payloadEvent.alarmLevel);
                
                $ctrl.events[payloadEvent.alarmLevel].unsilencedCount++;
            };
            
        },
        function(data) {
            console.log('error', data);
        }
    );
};

activeEventIconsController.$inject = ['Events', 'eventsEventManager'];

return {
    controller: activeEventIconsController,
    templateUrl: require.toUrl('./activeEventIcons.html')
};

}); // define