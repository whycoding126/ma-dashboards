/**
 * Javascript Objects for the Providing Data on HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

define(['jquery', './dataProvider'], function($, DataProvider) {

/**
 * @exports mango/statisticsDataProvider
 * @module {StatisticsDataProvider} mango/statisticsDataProvider
 * @augments DataProvider
 */
var StatisticsDataProvider = DataProvider.extend({
    /**
     * @constructs StatisticsDataProvider
     * @augments DataProvider
     * @param {string|number} id - ID for provider
     * @param {Object} options - custom options for provider
     */
    constructor: function(id, options) {
        DataProvider.apply(this, arguments);
    },

    /** @member {string} [type='StatisticsDataProvider'] - type of data provider*/
    type: 'StatisticsDataProvider',

    /**
     * Does the provider Need to Load data
     * @param {Object} changedOptions - { from: from date, to: to date, rollup: boolean, rollupValue: Array}
     * @returns {boolean}
     */
    needsToLoad: function(changedOptions) {
        if (changedOptions.from || changedOptions.to)
            return true;
        if((changedOptions.rollup) && (changedOptions.rollupValue === 'NONE'))
        	return true;
        return false;
    },
    
    /**
     * @param {Object} point - point to load with xid member
     * @param {Object} options - options {from: from date, to: to date}
     * @returns {Object} Statistics Object
     */
    loadPoint: function(point, options) {
        return this.mangoApi.getStatistics(point.xid, options.from, options.to, this.apiOptions);
    }
});

DataProvider.registerProvider(StatisticsDataProvider);
return StatisticsDataProvider;

}); // close define
