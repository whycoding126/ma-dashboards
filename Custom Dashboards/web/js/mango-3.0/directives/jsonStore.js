/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function jsonStore(JsonStore, $q) {
    return {
        scope: {
        	xid: '@',
            item: '=',
            value: '=?'
        },
        link: function ($scope, $element, attr) {
        	
            $scope.$watch('xid', function(newXid, oldXid) {
            	if (!newXid) return;
            	
            	JsonStore.get({xid: newXid}).$promise.then(function(item) {
            		return item;
            	}, function() {
            		var item = new JsonStore();
            		item.xid = newXid;
            		item.name = '';
            		return $q.when(item);
            	}).then(function(item) {
            		$scope.item = item;
            	});
            });
        }
    };
}

jsonStore.$inject = ['JsonStore', '$q'];
return jsonStore;

}); // define
