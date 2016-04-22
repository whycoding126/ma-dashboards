/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function pointQuery(Point) {
    return {
        scope: {
        	query: '@',
            points: '=',
            promise: '=?',
            clearOnQuery: '='
        },
        link: function ($scope, $element, attr) {
            $scope.$watch('query', function(value) {
                var newPoints = value ? Point.rql({query: value}) : Point.query();
                $scope.promise = newPoints.$promise;
                
                if ($scope.clearOnQuery) {
                    $scope.points = newPoints;
                } else {
                    newPoints.$promise['finally'](function(pts) {
                        $scope.points = newPoints;
                    });
                }
            });
        }
    };
}

pointQuery.$inject = ['Point'];
return pointQuery;

}); // define
