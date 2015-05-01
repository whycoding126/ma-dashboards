/**
 * Display that allows changing CSS attributes for Dom Nodes
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 * @module {CssDisplay} mango/CssDisplay
 * @see CssDisplay
 */
define(['jquery'], function($) {
"use strict";


/**
 * Css Display Constructor
 * @constructs CssDisplay
 * @param {Object} options - Options for Display
 */
function CssDisplay(options) {
    this.min = 0;
    this.max = 100;
    this.property = 'width';
    this.valueAttribute = 'value';
    this.limitPercentage = true;

    for(var i in options) {
        this[i] = options[i];
    }
    
    this.dataProviderIds = [this.dataProviderId];
};

/**
 * Dom Node of Display
 * @default null
 * @type {Object}
 */
CssDisplay.prototype.selection = null;

/**
 * Minimum Value for data
 * @default 0
 * @type {number}
 */
CssDisplay.prototype.min = 0;
/**
 * Maximum Value for data
 * @default 100
 * @type {number}
 */
CssDisplay.prototype.max = 100;
/**
 * Css Property to modify
 * @default null
 * @type {Object}
 */
CssDisplay.prototype.property = 'width';
/**
 * Value Attribute of Data
 * @default 'value'
 * @type {string}
 */
CssDisplay.prototype.valueAttribute = 'value';
/**
 * Limit the property to values 0-1
 * @default true
 * @type {boolean}
 */
CssDisplay.prototype.limitPercentage = true;


/**
 * Create the display
 */
CssDisplay.prototype.createDisplay = function() {
    return this;
};


/**
 * Called to clear display Defaults to setting width
 * to 0%, override as desired.
 */
CssDisplay.prototype.onClear = function() {
    this.selection.css('width', '0%');
};

/**
 * Called on Load 
 * @param{Object|Array} data - Data to load
 * @param{DataPoint} dataPoint - Data Point corresponding to data
 */
CssDisplay.prototype.onLoad = function(data, dataPoint) {
    if ($.isArray(data)) {
        data = data[0];
    }
    if (typeof data.minimum == 'object') {
        data.minimum = data.minimum.value;
        data.maximum = data.maximum.value;
        data.difference = data.maximum - data.minimum;
    }
    
    var value = data[this.valueAttribute];
    if (typeof this.manipulateValue === 'function')
        value = this.manipulateValue(value, dataPoint);
    
    var prop = {};
    var range = this.max - this.min;
    value = 1 - (this.max - value) / range;
    if (this.limitPercentage) {
        if (value < 0)
            value = 0;
        else if (value > 1)
            value = 1;
    }
    prop[this.property] = (value * 100).toFixed(2) + '%';
    
    this.selection.animate(prop, {
        duration: 500,
        easing: 'swing'
    });
};

return CssDisplay;

}); // define
