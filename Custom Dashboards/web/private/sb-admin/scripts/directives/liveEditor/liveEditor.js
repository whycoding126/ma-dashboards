'use strict';

angular.module('sbAdminApp').directive('liveEditor', ['$rootScope', '$templateRequest', '$sce', '$compile', function($rootScope, $templateRequest, $sce, $compile) {
	return {
	    //templateUrl: 'scripts/directives/liveEditor/liveEditor.html',
	    restrict: 'E',
	    scope: {
	    	src: '@'
	    },
	    compile: function($element, $attr, $transclude) {
	    	var text = $element.html().trim();
	    	$element.empty();
	    	
	    	return function($scope, $element, $attr) {
	        	$scope.text = text;
	        	
	        	var url = $sce.getTrustedResourceUrl('scripts/directives/liveEditor/liveEditor.html');
	    		$templateRequest(url).then(function(template) {
	    			$element.html($compile(template)($scope));
	    		});
	        }
	    },
	    controller: function($scope, $element) {
	    	var editor;
	    	var $previewElementChildScope;
	    	
	    	$scope.aceConfig = {
		      useWrapMode : true,
		      showGutter: false,
		      theme:'chrome',
		      mode: 'xml',
		      onLoad: function(editor_) {
		    	  editor = editor_;
		    	  editor.$blockScrolling = Infinity;
		    	  if ($scope.text) {
		    		  editor.setValue($scope.text, -1);
		    	  }
		      },
		      onChange: debounce(function() { // TODO dont debounce on programatic change
		    	  $scope.text = editor.getValue();
		    	  updatePreview();
		      }, 500)
		    };
	    	
	    	$scope.$watch('src', function(newValue) {
	    		if (!newValue) return;

	    		var url = $sce.getTrustedResourceUrl(newValue);
	    		$templateRequest(url).then(function(text_) {
	    			$scope.text = text_;
	    		});
	    	});
	    	
	    	$scope.$watch('text', function(newValue) {
	    		if (!newValue) return;
	    		
	    		if (editor) {
    				editor.setValue(newValue, -1);
    			}
	    	});
	    	
	    	function updatePreview() {
		    	var $previewElement = $element.find('.editor-preview');
		    	var $previewElementScope = angular.element($previewElement).scope();
	    		if ($previewElementChildScope) $previewElementChildScope.$destroy();
	    		$previewElementChildScope = $previewElementScope.$new();
	    		$previewElement.addClass('ng-scope');
	    		$previewElement.data('scope', $previewElementChildScope);
	    		$previewElement.html($compile($scope.text)($previewElementChildScope));
	    	}
	    	
	    	// Returns a function, that, as long as it continues to be invoked, will not
	    	// be triggered. The function will be called after it stops being called for
	    	// N milliseconds. If `immediate` is passed, trigger the function on the
	    	// leading edge, instead of the trailing.
	    	function debounce(func, wait, immediate) {
	    		var timeout;
	    		return function() {
	    			var context = this, args = arguments;
	    			var later = function() {
	    				timeout = null;
	    				if (!immediate) func.apply(context, args);
	    			};
	    			var callNow = immediate && !timeout;
	    			clearTimeout(timeout);
	    			timeout = setTimeout(later, wait);
	    			if (callNow) func.apply(context, args);
	    		};
	    	};
	    }
	};
}]);
