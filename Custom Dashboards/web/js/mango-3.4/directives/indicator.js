/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

IndicatorController.$inject = ['$element', '$attrs', 'Util'];
function IndicatorController($element, $attrs, Util) {
    this.$element = $element;
    this.$attrs = $attrs;
    this.Util = Util;
    
    $element.addClass('live-value');
    this.prevValues = {};
}

IndicatorController.prototype.$onChanges = function(changes) {
    if (changes.value || changes.point) {
        this.updateIndicator();
    }
};

IndicatorController.prototype.$doCheck = function() {
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
            this.updateIndicator();
        }
    }
};

IndicatorController.prototype.updateIndicator = function() {
    // jshint eqnull:true
    var value;
    if (this.value != null) {
        value = this.value;
    } else if (this.point && this.point.convertedValue != null) {
        value = this.point.convertedValue;
    } else if (this.point && this.point.value != null) {
        value = this.point.value;
    }
    
    var color = '';
    if (value != null) {
        var attrName = this.Util.camelCase('color-' + value);
        color = this.$attrs[attrName];
    }
    this.$element.css('background-color', color);
};

function indicator() {
    return {
        restrict: 'E',
        designerInfo: {
            translation: 'dashboards.v3.components.indicator',
            icon: 'lightbulb_outline',
            category: 'pointValue',
            attributes: {
                colorTrue: {
                    type: 'color'
                },
                colorFalse: {
                    type: 'color'
                }
            }
        },
        bindToController: {
            point: '=?',
            value: '=?'
        },
        scope: false,
        controller: IndicatorController
    };
}

return indicator;

}); // define
