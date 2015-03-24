/**
 * Javascript Objects for the Providing Data on HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

define(['jquery', './dataProvider'], function($, DataProvider) {
"use strict";

var PointValueDataProvider = DataProvider.extend({
    /**
     * Data Provider constructor
     * @param id
     * @param options
     * @returns
     */
    constructor: function(id, options) {
        DataProvider.apply(this, arguments);
    },
    
    type: 'PointValueDataProvider',
    
    needsToLoad: function(changedOptions) {
        if (changedOptions.from || changedOptions.to || changedOptions.rollup ||
                changedOptions.timePeriodType || changedOptions.timePeriods)
            return true;
        return false;
    },

    loadPoint: function(point, options) {
        var apiOptions = $.extend({}, this.apiOptions, {
            rollup: options.rollup,
            timePeriodType: options.timePeriodType,
            timePeriods: options.timePeriods
        });
        return this.mangoApi.getValues(point.xid, options.from, options.to, apiOptions);
    }
});

DataProvider.registerProvider(PointValueDataProvider);
return PointValueDataProvider;

}); // close define
