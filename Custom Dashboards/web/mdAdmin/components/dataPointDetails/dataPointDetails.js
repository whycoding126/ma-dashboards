/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var dataPointDetailsController = function dataPointDetailsController($scope, $stateParams, $state, UserNotes, Events) {
    
    this.$onInit = function() {
        if ($stateParams.pointXid) {
            console.log($stateParams.pointXid);
            this.pointXid = $stateParams.pointXid;
        }
        else {
            // Load pointXid from local storage
        }
    };
    
    
    $scope.$watch('myPoint.xid', function(newValue, oldValue) {
        if (newValue === undefined || newValue === oldValue) return;
        // console.log(newValue);
        // $state.go('.', {pointXid: newValue}, {location: 'replace', notify: false});
    });
    
    
    this.addNote = UserNotes.addNote;
    
    var $this = this;
    Events.query().$promise.then(function(Events) {
        $this.events = Events;
    });
};

dataPointDetailsController.$inject = ['$scope','$stateParams', '$state', 'UserNotes', 'Events'];

return {
    controller: dataPointDetailsController,
    templateUrl: require.toUrl('./dataPointDetails.html')
};

}); // define