/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

ScaleToWindow.$inject = [];
function ScaleToWindow() {
    return {
        restrict: 'A',
        scope: false,
        bindToController: {
            scaleToWindow: '<?maScaleToWindow',
            maintainRatio: '<?maMaintainRatio',
            center: '<?maCenter'
        },
        controller: ScaleToWindowController
    };
}

ScaleToWindowController.$inject = ['$scope', '$element', '$window', '$timeout'];
function ScaleToWindowController($scope, $element, $window, $timeout) {
    this.$scope = $scope;
    this.$element = $element;
    this.$window = angular.element($window);
    this.$timeout = $timeout;

    this.handlerAttached = false;
    this.resizeHandler = this.scaleElement.bind(this);
}

ScaleToWindowController.prototype.$onInit = function() {
    var $ctrl = this;

    if (this.scaleToWindow == null)
        this.scaleToWindow = true;
    if (this.maintainRatio == null)
        this.maintainRatio = true;
    if (this.center == null)
        this.center = true;
    
    if (this.scaleToWindow) {
        this.bindHandler();
        this.scaleElement();
    }
    
    this.$scope.$on('$destroy', function() {
        $ctrl.unbindHandler();
    });
};

ScaleToWindowController.prototype.$onChanges = function(changes) {
    if (changes.scaleToWindow) {
        if (this.scaleToWindow) {
            this.bindHandler();
            this.scaleElement();
        } else {
            this.unbindHandler();
            this.removeScaling();
        }
    }
    if (changes.maintainRatio || changes.center) {
        if (this.scaleToWindow) {
            this.scaleElement();
        }
    }
};

ScaleToWindowController.prototype.bindHandler = function bindHandler() {
    if (!this.handlerAttached) {
        this.$window.on('resize', this.resizeHandler);
        this.handlerAttached = true;
    }
};

ScaleToWindowController.prototype.unbindHandler = function unbindHandler() {
    if (this.handlerAttached) {
        this.$window.off('resize', this.resizeHandler);
        this.handlerAttached = false;
    }
};

ScaleToWindowController.prototype.removeScaling = function removeScaling() {
    this.$element.css('transform', '');
    this.$element.css('transform-origin', '');
    this.$element.css('position', '');
    if (this.center) {
        this.$element.css('left', '');
        this.$element.css('top', '');
    }
};

ScaleToWindowController.prototype.scaleElement = function scaleElement($event, isNextDigest) {
    if (this.$element.hasClass('ma-designer-element')) return;

    var elementWidth = parseInt(this.$element[0].style.width, 10);
    var elementHeight = parseInt(this.$element[0].style.height, 10);
    var windowWidth = this.$window.width();
    var windowHeight = this.$window.height();

    var widthRatio = windowWidth / elementWidth;
    var heightRatio = windowHeight / elementHeight;
    
    //console.log('element('+elementWidth+','+elementHeight+') window('+windowWidth+','+windowHeight+')');
    //console.log('heightRatio:' + heightRatio + ' widthRatio:'+widthRatio);

    if (this.maintainRatio) {
        if (heightRatio < widthRatio) {
            widthRatio = heightRatio;
        } else {
            heightRatio = widthRatio;
        }
    }

    var widthRemainder = windowWidth - elementWidth * widthRatio;
    var heightRemainder = windowHeight - elementHeight * heightRatio;
    
    this.$element.css('transform', 'scale(' + widthRatio + ',' + heightRatio + ')');
    this.$element.css('transform-origin', '0 0');
    this.$element.css('position', 'absolute');
    if (this.center) {
        this.$element.css('left', widthRemainder/2 + 'px');
        this.$element.css('top', heightRemainder/2 + 'px');
    } else {
        this.$element.css('left', '');
        this.$element.css('top', '');
    }
    
    // run again on next digest, re-calc height/width after scrollbars are removed
    if (!isNextDigest) {
        this.$timeout(function() {
            this.scaleElement(null, true);
        }.bind(this), 0);
    }
};

return ScaleToWindow;

}); // define
