/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'ace'], function(require) {
'use strict';

var prettyprint = function() {
    return {
        restrict: 'C',
        scope: {
            prettyprintMode: '@'
        },
        link: function($scope, $element) {
            $scope.editor = ace.edit($element[0]);
            $scope.editor.setTheme("ace/theme/chrome");
            $scope.editor.getSession().setMode("ace/mode/" + (prettyprintMode || 'html'));
            $scope.editor.setShowPrintMargin(false);
            $scope.editor.setReadOnly(true);
            $scope.editor.setHighlightActiveLine(false);
            $scope.editor.renderer.setShowGutter(false);
            $scope.editor.cursorStyle = 'none';
            $scope.editor.setOptions({
                maxLines: Infinity
            });
            $element[0].style.fontSize = '1.2em';
        }
    };
};

prettyprint.$inject = [];

return prettyprint;

}); // define
