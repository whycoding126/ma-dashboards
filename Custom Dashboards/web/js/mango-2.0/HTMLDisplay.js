/**
 * Display Raw HTML in a Dom Node
 * 
 * This doc needs work, probably do a base class like the Data Providers
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire, Terry Packer
 * @module {HTMLDisplay} mango/HTMLDisplay
 * @see HTMLDisplay
 */
define(['jquery'], function($) {
	
/**
 * @constructs HTMLDisplay
 * @param {Object} options - options for display
 */
function HTMLDisplay(options) {
	
    this.valueAttribute = 'value';
    this.suffix = '';
    this.decimalPlaces = 2;
    this.inhibitUpdateOnFocus = $(null);

    for(var i in options) {
        this[i] = options[i];
    }
    
    this.dataProviderIds = [this.dataProviderId];
};
	
/** 
 * Dom Node to Place Displayed data in
 * @type {!Object}
 */
HTMLDisplay.prototype.selection = null;

/** 
 * Member of data to use in rendering 
 * @type {string} 
 * @default 'value'
 */
HTMLDisplay.prototype.valueAttribute = 'value';
/** 
 * any appending text for rendering the value
 * @type {string} 
 * @default ''
 */
HTMLDisplay.prototype.suffix = '';
/** 
 * number of decimal places to round the rendered value
 * @type {number}  
 * @default 2
 */
HTMLDisplay.prototype.decimalPlaces = 2;
/** 
 * Don't update the node if it is in focus
 * @type {?Object}
 */
HTMLDisplay.prototype.inhibitUpdateOnFocus = $(null);



/**
 * Create the display - legacy use
 * 
 */
HTMLDisplay.prototype.createDisplay = function() {
    return this;
};

/**
 * Data Provider listener to clear data
 */
HTMLDisplay.prototype.onClear = function() {
    if (this.useVal) {
        var inputs = this.selection.filter('input');
        var others = this.selection.not(inputs);
        inputs.val('');
        others.html('');
    }
    else {
        this.selection.html('');
    }
    delete this.previous;
};

/**
 * Data Provider Listener
 * On Data Provider load we add new data
 * @param {Array | number} data - Value to update with if array then data[0] is used
 * @param {Object} dataPoint - data point that corresponds to the value
 */
HTMLDisplay.prototype.onLoad = function(data, dataPoint) {
    if ($.isArray(data)) {
        if (data.length) {
            data = data[0];
        }
        else return;
    }
    
    if (typeof data.minimum == 'object') {
        data.minimum = data.minimum.value;
        data.maximum = data.maximum.value;
        data.difference = data.maximum - data.minimum;
    }
    
    var value = data[this.valueAttribute];
    if (value === null || value === undefined) {
        // we will often want convertedValue or renderedValue but they aren't available
        // on non-numeric points
        value = data.value;
    }
    
    if (typeof this.manipulateValue === 'function')
        value = this.manipulateValue(value, dataPoint);

    var rendered = this.renderText(value);
    
    if (typeof this.onChange === 'function') {
        if (this.previous !== undefined && rendered !== this.previous) {
            this.onChange();
        }
        this.previous = rendered;
    }
    
    if (this.useVal) {
        var inputs = this.selection.filter('input');
        var others = this.selection.not(inputs);
        
        if (this.inhibitUpdateOnFocus.filter(':focus').length === 0) {
            inputs.filter(':not(:focus)').val(rendered);
        }
        others.html(rendered);
    }
    else {
        this.selection.html(rendered);
    }
};

/**
 * Render The Point Value Time as String
 * @param {PointValueTimeModel|number} value - Point Value Time
 * @returns {string}
 */
HTMLDisplay.prototype.renderText = function(value) {
    // PointValueTime
    if (value && typeof value === 'object' && 'value' in value && 'timestamp' in valuevalue) {
        return this.renderValue(value.value);
    }
    
    return this.renderValue(value);
};

/**
 * Render a number as a string
 * @param {number} value - Number value to render
 * @return {string} rendered text
 */
HTMLDisplay.prototype.renderValue = function(value) {
    if (typeof value === 'number')
        return value.toFixed(this.decimalPlaces) + this.suffix;
    return value;
};

return HTMLDisplay;

}); // define
