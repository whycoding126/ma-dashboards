'use strict';

angular.module('sbAdminApp').directive('livePreview', ['$compile', '$timeout', function($compile, $timeout) {
	return {
	    scope: false,
	    link: function($scope, $element, $attrs) {
	    	var childScope = $scope.$new();
	    	var timeoutPromise;
    		$element.data('scope', childScope);
    		$element.addClass('ng-scope');
    		
    		var debounceTimeout = 1000;
    		if ($attrs.debounce) {
    			debounceTimeout = parseInt($attrs.debounce, 10);
    		}
    		
	    	$scope.$watch($attrs.livePreview, function(newValue, oldValue) {
	    		if (newValue === oldValue || !oldValue || debounceTimeout === 0) {
	    			updatePreview(newValue);
	    		} else {
	    			if (timeoutPromise) {
	    				$timeout.cancel(timeoutPromise);
	    				timeoutPromise = null;
	    			}
	    			timeoutPromise = $timeout(updatePreview, debounceTimeout, true, newValue);
	    		}
	    	});
	    	
	    	function updatePreview(text) {
	    		timeoutPromise = null;
	    		
	    		childScope.$destroy();
	    		childScope = $scope.$new();
	    		$element.data('scope', childScope);
	    		
	    		if (text) {
	    			$element.html($compile(text)(childScope));
	    		} else {
	    			$element.empty();
	    		}
	    	}
	    }
	};
}]);
