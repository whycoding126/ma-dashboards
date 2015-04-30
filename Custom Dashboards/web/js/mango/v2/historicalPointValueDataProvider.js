/**
 * Access Historical Data by a count of samples back from latest value
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire, Terry Packer
 * @exports mango/HTMLDisplay
 * @module {HistoricalDataProvider} mango/historicalDataProvider
 * @augments DataProvider
 */

define(['jquery', './dataProvider'], function($, DataProvider) {

var HistoricalPointValueDataProvider = DataProvider.extend({
    /**
     * @constructs HistoricalDataProvider
     * @param {number|string} id - ID For provider
     * @param {Object} options - options for provider
     * @augments DataProvider
     */
    constructor: function(id, options) {
        DataProvider.apply(this, arguments);
    },

    /** @member {string} [type='HistoricalDataProvider'] - Type of Provider */
    type: 'HistoricalPointValueDataProvider',

    /**
     * @param {Object} point - point to load with xid member
     * @param {Object} options - options {historicalSamples: number}
     * @returns {Promise} - Promise of latest values to be returned
     */
    loadPoint: function(point, options) {
        return this.mangoApi.getLatestValues(point.xid, options.historicalSamples, this.apiOptions);
    }
});

DataProvider.registerProvider(HistoricalPointValueDataProvider);
return HistoricalPointValueDataProvider;

}); // close define