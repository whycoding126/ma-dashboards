/**
 * Data Provider for RealTime Updates Via Web Sockets
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 * @exports mango/accumulatorDataProvider
 * @module {AccumulatorDataProvider} mango/accumulatorDataProvider
 * @augments DataProvider
 */
define(['jquery', './dataProvider'], function($, DataProvider) {
"use strict";

/**
 * Accumulator Data Providers compute accumulation of point values over time
 * @constructs AccumulatorDataProvider
 * @param {number} id - Data Provider ID
 * @param {Object} options - Extra options desired
 */
function AccumulatorDataProvider(id, options) {
    DataProvider.apply(this, arguments);
}

AccumulatorDataProvider.prototype = Object.create(DataProvider.prototype);

/** @member {string} [type='AccumulatorDataProvider'] - type of data provider*/
AccumulatorDataProvider.prototype.type = 'AccumulatorDataProvider';

/**
 * @typedef AccumulatorDataProviderChangedOptions
 * @param {boolean} to - Has the to date changed?
 * @param {boolean} from - Has the from date changed?
 */

/**
 * Does the Data Provider Need to reload?
 * @param {AccumulatorDataProviderChangedOptions}
 */
AccumulatorDataProvider.prototype.needsToLoad = function(changedOptions) {
    if (changedOptions.from || changedOptions.to)
        return true;
    return false;
};

AccumulatorDataProvider.prototype.loadPoint = function(point, options) {
    var promise = this.mangoApi.getFirstLastValues(point.xid, options.from, options.to, this.apiOptions)
    .then(function(data) {
        var result = {};
        result.value = data[1].value - data[0].value;
        result.first = data[0];
        result.last = data[1];
        return result;
    });
    return promise;
};

DataProvider.registerProvider(AccumulatorDataProvider);
return AccumulatorDataProvider;

}); // close define