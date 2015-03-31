/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery', 'moment-timezone'], function($, moment) {
"use strict";

/**
 * Configuration for StatisticsDisplay
 * @param options
 * @returns
 */
var StatisticsDisplay = function(options) {
    this.container = $('body');
    
    $.extend(this, options);
};

/**
 * Serial Chart Config
 */
StatisticsDisplay.prototype = {
    useXidContainer: false,
    decimalPlaces: 2,
    separateValueAndTime: false,
    
    /**
     * Do the heavy lifting and create the item
     * @return AmChart created
     */
    createDisplay: function() {
        return this;
    },

    /**
     * Data Provider listener to clear data
     */
    onClear: function() {
        var all = this.container.find('.minimum, .maximum, .average, .integral, .sum, .first, .last, .count');
        if (this.separateValueAndTime) {
            all.find('.value, .time, .value-time').text('');
            all.hide();
        } else {
            all.text('').hide();
        }
    },
    
    /**
     * Data Provider Listener
     * On Data Provider load we add new data
     */
    onLoad: function(data, dataPoint) {
        this.removeLoading();
        
        if (!data.hasData) {
            this.container.find('.no-data').show();
        }
        
        var container = this.useXidContainer ? this.container.find('.point-' + dataPoint.xid) : this.container;
        
        var minimum = container.find('.minimum');
        var maximum = container.find('.maximum');
        var average = container.find('.average');
        var integral = container.find('.integral');
        var sum = container.find('.sum');
        var first = container.find('.first');
        var last = container.find('.last');
        var count = container.find('.count');
        
        if (this.separateValueAndTime) {
            if (data.minimum) {
                minimum.find('.value').text(this.renderValue(data.minimum.value));
                minimum.find('.time').text(this.renderTime(data.minimum.timestamp));
                minimum.find('.value-time').text(this.renderPointValueTime(data.minimum));
                minimum.show();
            }
            
            if (data.maximum) {
                maximum.find('.value').text(this.renderValue(data.maximum.value));
                maximum.find('.time').text(this.renderTime(data.maximum.timestamp));
                maximum.find('.value-time').text(this.renderPointValueTime(data.maximum));
                maximum.show();
            }
            
            if (data.first) {
                first.find('.value').text(this.renderValue(data.first.value));
                first.find('.time').text(this.renderTime(data.first.timestamp));
                first.find('.value-time').text(this.renderPointValueTime(data.first));
                first.show();
            }
            
            if (data.last) {
                last.find('.value').text(this.renderValue(data.last.value));
                last.find('.time').text(this.renderTime(data.last.timestamp));
                last.find('.value-time').text(this.renderPointValueTime(data.last));
                last.show();
            }
            
            if (data.average) {
                average.find('.value').text(this.renderValue(data.average.value));
                average.show();
            }

            if (data.integral) {
                integral.find('.value').text(this.renderValue(data.integral.value));
                integral.show();
            }

            if (data.sum) {
                sum.find('.value').text(this.renderValue(data.sum.value));
                sum.show();
            }

            if (data.count) {
                count.find('.value').text(this.renderCount(data.count));
                count.show();
            }
        }
        else {
            minimum.text(this.renderPointValueTime(data.minimum)).show();
            maximum.text(this.renderPointValueTime(data.maximum)).show();
            first.text(this.renderPointValueTime(data.first)).show();
            last.text(this.renderPointValueTime(data.last)).show();
            average.text(this.renderValue(data.average.value)).show();
            integral.text(this.renderValue(data.integral.value)).show();
            sum.text(this.renderValue(data.sum.value)).show();
            count.text(this.renderValue(data.count)).show();
        }
    },
    
    renderPointValueTime: function(pvt) {
       return this.renderValue(pvt.value) + ' @ ' + this.renderTime(pvt.timestamp);  
    },
    
    renderValue: function(value) {
        if (typeof value === 'number') return value.toFixed(this.decimalPlaces);
        return value;
    },
    
    renderCount: function(value) {
        if (typeof value === 'number') return value.toFixed(0);
        return value;
    },
    
    renderTime: function(timestamp) {
        return moment(timestamp).format('lll');
    },
    
    loading: function() {
        this.container.find('.loading').show();
        this.container.find('.no-data').hide();
    },
    
    removeLoading: function() {
        this.container.find('.loading').hide();
    }
};

return StatisticsDisplay;

}); // close define