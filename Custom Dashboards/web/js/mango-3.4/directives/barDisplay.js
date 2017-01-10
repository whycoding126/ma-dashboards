/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

BarDisplayController.$inject = ['$element'];
function BarDisplayController($element) {
    this.$element = $element;
    
    $element.addClass('live-value');
    this.prevValues = {};
    this.style = {};
}

BarDisplayController.prototype.$onChanges = function(changes) {
    if (changes.value || changes.point || changes.maximum || changes.minimum || changes.direction) {
        this.updateBar();
    }
};

BarDisplayController.prototype.$doCheck = function() {
    if (this.point) {
        if (this.point.enabled !== this.prevValues.enabled) {
            this.prevValues.enabled = this.point.enabled;
            if (this.point.enabled) {
                this.$element.removeClass('point-disabled');
            } else {
                this.$element.addClass('point-disabled');
            }
        }
        
        if (this.point.value !== this.prevValues.value) {
            this.prevValues.value = this.point.value;
            this.updateBar();
        }
    }
};

BarDisplayController.prototype.updateBar = function() {
    // jshint eqnull:true
    var value = 0;
    if (this.value != null) {
        value = this.value;
    } else if (this.point && this.point.convertedValue != null) {
        value = this.point.convertedValue;
    } else if (this.point && this.point.value != null) {
        value = this.point.value;
    }
    
    var maximum = this.maximum || 100;
    var minimum = this.minimum || 0;
    var range = maximum - minimum;
    var percent = (value / range * 100) + '%';
    
    delete this.style.top;
    delete this.style.bottom;
    delete this.style.left;
    delete this.style.right;

    if (this.direction === 'bottom-to-top') {
        this.style.height = percent;
        this.style.width = '100%';
        this.style.bottom = 0;
    } else if (this.direction === 'top-to-bottom') {
        this.style.height = percent;
        this.style.width = '100%';
        this.style.top = 0;
    } else if (this.direction === 'right-to-left') {
        this.style.width = percent;
        this.style.height = '100%';
        this.style.right = 0;
    } else {
        this.style.width = percent;
        this.style.height = '100%';
    }
};

function barDisplay() {
    return {
        restrict: 'E',
        designerInfo: {
            translation: 'dashboards.v3.components.barDisplay',
            icon: 'trending_flat',
            category: 'pointValue',
            attributes: {
                direction: {
                    options: ['left-to-right', 'bottom-to-top', 'right-to-left', 'top-to-bottom']
                }
            }
        },
        bindToController: {
            direction: '@?',
            point: '=?',
            value: '=?',
            maximum: '=?',
            minimum: '=?'
        },
        template: '<div class="bar-display-fill" ng-style="$ctrl.style"></div>',
        scope: {},
        controller: BarDisplayController,
        controllerAs: '$ctrl'
    };
}

return barDisplay;

}); // define
