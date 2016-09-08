/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var eventsPageController = function eventsPageController($scope, $stateParams, $state, UserNotes, localStorageService) {
    
    this.addNote = UserNotes.addNote;
    
    var $ctrl = this;
    
    this.$onInit = function() {
        if ($stateParams.eventType) {
            console.log($stateParams.eventType);
            $ctrl.eventType = $stateParams.eventType;
        }
        else {
            $ctrl.eventType = '*';
        }
        
        if ($stateParams.alarmLevel) {
            console.log($stateParams.alarmLevel);
            $ctrl.alarmLevel = $stateParams.alarmLevel;
        }
        else {
            $ctrl.alarmLevel = '*';
        }
        
        $scope.$watch('$ctrl.eventType', function(newValue, oldValue) {
            if (newValue === undefined || newValue === oldValue) return;
            //console.log('New point selected:', newValue);
            $state.go('.', {eventType: newValue}, {location: 'replace', notify: false});
        });
        
        $scope.$watch('$ctrl.alarmLevel', function(newValue, oldValue) {
            if (newValue === undefined || newValue === oldValue) return;
            //console.log('New point selected:', newValue);
            $state.go('.', {alarmLevel: newValue}, {location: 'replace', notify: false});
        });
        
    };
    
    
    
    
};

eventsPageController.$inject = ['$scope','$stateParams', '$state', 'UserNotes', 'localStorageService'];

return {
    controller: eventsPageController,
    templateUrl: require.toUrl('./eventsPage.html')
};

}); // define