/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var eventsPageController = function eventsPageController($scope, $mdMedia, $stateParams, $state, localStorageService, MD_ADMIN_SETTINGS) {
    
    var $ctrl = this;
    $ctrl.$mdMedia = $mdMedia;
    $ctrl.dateBar = MD_ADMIN_SETTINGS.dateBar;
    
    $ctrl.$onInit = function() {
        
        if ($stateParams.sortOrder) {
            console.log($stateParams.sortOrder);
            $ctrl.sort = $stateParams.sortOrder;
        }
        else {
            $ctrl.sort = '-activeTimestamp';
        }
        
        if ($stateParams.eventType) {
            // console.log($stateParams.eventType);
            $ctrl.eventType = $stateParams.eventType;
        }
        else {
            // Attempt load from local storage
            var storedEventType = localStorageService.get('lastEventTypeItem');
            if (storedEventType) {
                $ctrl.eventType = storedEventType;
            }
            else {
                // Otherwise set to all
                $ctrl.eventType = '*';
            }
        }
        
        if ($stateParams.alarmLevel) {
            // console.log($stateParams.alarmLevel);
            $ctrl.alarmLevel = $stateParams.alarmLevel;
        }
        else {
            // Attempt load from local storage
            var storedAlarmLevel = localStorageService.get('lastAlarmLevelItem');
            if (storedAlarmLevel) {
                $ctrl.alarmLevel = storedAlarmLevel;
            }
            else {
                // Otherwise set to all
                $ctrl.alarmLevel = '*';
            }
        }
        
        if ($stateParams.acknowledged) {
            // console.log($stateParams.acknowledged);
            $ctrl.acknowledged = $stateParams.acknowledged;
        }
        else {
            // Attempt load from local storage
            var storedAcknowledged = localStorageService.get('acknowledged');
            if (storedAcknowledged) {
                $ctrl.acknowledged = storedAcknowledged;
            }
            else {
                // Otherwise set to all
                $ctrl.acknowledged = '*';
            }
        }
        
        $scope.$watch('$ctrl.eventType', function(newValue, oldValue) {
            if (newValue === undefined || newValue === oldValue) return;
            //console.log('New point selected:', newValue);
            $state.go('.', {eventType: newValue}, {location: 'replace', notify: false});
            localStorageService.set('lastEventTypeItem', newValue);
        });
        
        $scope.$watch('$ctrl.alarmLevel', function(newValue, oldValue) {
            if (newValue === undefined || newValue === oldValue) return;
            //console.log('New point selected:', newValue);
            $state.go('.', {alarmLevel: newValue}, {location: 'replace', notify: false});
            localStorageService.set('lastAlarmLevelItem', newValue);
        });
        
        $scope.$watch('$ctrl.acknowledged', function(newValue, oldValue) {
            if (newValue === undefined || newValue === oldValue) return;
            //console.log('New point selected:', newValue);
            $state.go('.', {acknowledged: newValue}, {location: 'replace', notify: false});
            localStorageService.set('acknowledged', newValue);
        });
        
    };
    
    
    
    
};

eventsPageController.$inject = ['$scope', '$mdMedia', '$stateParams', '$state', 'localStorageService', 'MD_ADMIN_SETTINGS'];

return {
    controller: eventsPageController,
    templateUrl: require.toUrl('./eventsPage.html')
};

}); // define