'use strict';

angular.module('sbAdminApp').directive('dualPaneEditor', [function() {
	return {
		templateUrl: function($element, attrs) {
			var htmlContent = $element.html().trim();
			$element.empty();
			if (htmlContent)
				$element.data('htmlContent', htmlContent);
			return 'scripts/directives/liveEditor/dualPaneEditor.html';
		},
		link: function($scope, $element, $attrs) {
			var content = $element.data('htmlContent');
			$element.removeData('htmlContent');
			if (content) {
				var editor = $element.find('div[live-editor]')[0];
				var editorCtrl = angular.element(editor).controller('liveEditor');
				editorCtrl.setText(content);
			}
		}
	};
}]);
