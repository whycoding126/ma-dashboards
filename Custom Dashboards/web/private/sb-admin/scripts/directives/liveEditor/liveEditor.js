'use strict';

angular.module('sbAdminApp').directive('liveEditor', ['$templateRequest', '$sce', function($templateRequest, $sce) {
	return {
		template: function($element, attrs) {
			var htmlContent = $element.html().trim();
			$element.empty();
			if (htmlContent)
				$element.data('htmlContent', htmlContent);
			return '<div ui-ace="aceConfig"></div>';
		},
		scope: {
			src: '@',
			text: '=liveEditor'
		},
		controller: function($scope, $element) {
			var editor;
			var initialText = $element.data('htmlContent');
			$element.removeData('htmlContent');
			var programaticChange = false;

			$scope.aceConfig = {
					useWrapMode : true,
					showGutter: false,
					theme:'chrome',
					mode: 'xml',
					onLoad: function(editor_) {
						editor = editor_;
						editor.$blockScrolling = Infinity;
						if (initialText) {
							programaticChange = true;
							editor.setValue(initialText, -1);
						}
					},
					onChange: aceChanged
			};

			$scope.$watch('src', function(newValue) {
				if (!newValue) return;

				var url = $sce.getTrustedResourceUrl(newValue);
				$templateRequest(url).then(function(text_) {
					editor.setValue(text_, -1);
				});
			});
			
			this.setText = function(text) {
				programaticChange = true;
				editor.setValue(text, -1);
			};
			
			function aceChangedImpl() {
				$scope.text = editor.getValue();
			}
			
			var aceChangedDebounced = debounce(function() {
				$scope.$apply(function() {
					aceChangedImpl();
				});
			}, 1000);
			
			function aceChanged() {
				if (programaticChange) {
					programaticChange = false;
					aceChangedImpl();
				} else {
					aceChangedDebounced();
				}
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
