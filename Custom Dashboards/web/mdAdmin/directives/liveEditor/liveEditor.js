/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'angular-ui-ace'], function(require) {
'use strict';

var liveEditor = function($templateRequest, $sce) {
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
            text: '=liveEditor',
            mode: '@',
            theme: '@',
            onEdit: '&?'
        },
        controller: ['$scope', '$element', 'mdAdminSettings', function($scope, $element, mdAdminSettings) {
            
            var initialText = $element.data('htmlContent');
            $element.removeData('htmlContent');
            
            var editor;
            var currentText;
            var programaticChange = false;

            this.setText = setText;

            $scope.aceConfig = {
                    useWrapMode : true,
                    showGutter: false,
					showPrintMargin: false,
                    theme: $scope.theme || mdAdminSettings.codeTheme,
                    fontSize: '13px',
                    mode: $scope.mode || 'html',
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
                if (newValue !== undefined && newValue !== currentText) {
                    if (editor) {
                        setText(newValue);
                    } else {
                        initialText = initialText || newValue;
                    }
                }
            });
            
            $scope.$watch('theme', function(newValue) {
                if (!newValue) return;
                
                editor.setTheme('ace/theme/' + newValue);
            });
            
            function aceChanged() {
                currentText = editor.getValue();
                if ($scope.text !== currentText) {
                    $scope.text = currentText;
                    if ($scope.onEdit) {
                        $scope.onEdit({$text: currentText});
                    }
                }
            }

            function setText(text) {
                programaticChange = true;
                editor.setValue(text, -1);
            };
        }]
    };
};

liveEditor.$inject = ['$templateRequest', '$sce'];

return liveEditor;

}); // define
