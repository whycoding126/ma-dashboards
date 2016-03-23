'use strict';

angular.module('mdAdminApp').directive('liveEditor', ['$templateRequest', '$sce', function($templateRequest, $sce) {
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
			
			var initialText = $element.data('htmlContent');
			$element.removeData('htmlContent');
			
			var editor;
			var currentText;
			var programaticChange = false;

			this.setText = setText;

			$scope.aceConfig = {
					useWrapMode : true,
					showGutter: false,
					theme:'chrome',
					mode: 'html',
					onLoad: function(editor_) {
						editor = editor_;
						editor.$blockScrolling = Infinity;
						if (initialText) {
							setText(initialText);
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
			
			$scope.$watch('text', function(newValue) {
				if (newValue && newValue !== currentText) {
					if (editor) {
						setText(newValue);
					} else {
						initialText = initialText || newValue;
					}
				}
			});
			
			function aceChanged() {
				$scope.text = currentText = editor.getValue();
			}

			function setText(text) {
				programaticChange = true;
				editor.setValue(text, -1);
			};
		}
	};
}]);
