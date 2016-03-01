'use strict';

angular.module('sbAdminApp').directive('livePreview', ['$compile', function($compile) {
	return {
	    scope: false,
	    link: function($scope, $element, $attrs) {
	    	var childScope = $scope.$new();
    		$element.data('scope', childScope);
    		$element.addClass('ng-scope');
	    	
	    	$scope.$watch($attrs.livePreview, function(newValue, oldValue) {
	    		if (newValue === undefined) return;
	    		
	    		childScope.$destroy();
	    		childScope = $scope.$new();
	    		$element.data('scope', childScope);
	    		
	    		if (newValue) {
	    			$element.html($compile(newValue)(childScope));
	    		} else {
	    			$element.empty();
	    		}
	    		
	    	});
	    }
	};
}]);
