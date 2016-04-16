/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function pointHierarchy(PointHierarchy) {
    return {
        scope: {
        	path: '=',
            hierarchy: '=',
            points: '=?'
        },
        link: function ($scope, $element, attrs) {
            $scope.$watchCollection('path', function(value) {
                if (!value) {
                    delete $scope.hierarchy;
                    delete $scope.points;
                }
                
                if (typeof value === 'string') {
                    value = value.split(',');
                }
                
            	$scope.hierarchy = value.length ? PointHierarchy.byPath({path: value}) : PointHierarchy.getRoot();
            	$scope.hierarchy.$promise.then(null, function() {
            	    delete $scope.hierarchy;
                    delete $scope.points;
            	});
            	
            	// only do the work if we are actually going to use it
            	if (attrs.points !== undefined) {
            	    $scope.hierarchy.$promise.then(function(folder) {
                        $scope.points = getPoints(folder);
            	    });
            	}
            });
        }
    };
    
    function getPoints(folder) {
        var points = [];
        Array.prototype.push.apply(points, folder.points);
        for (var i = 0; i < folder.subfolders.length; i++) {
            Array.prototype.push.apply(points, getPoints(folder.subfolders[i]));
        }
        return points;
    }
}

pointHierarchy.$inject = ['PointHierarchy'];
return pointHierarchy;

}); // define
