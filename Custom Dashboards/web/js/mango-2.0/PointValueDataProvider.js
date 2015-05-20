/**
 * Access Point Value Data
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Terry Packer, Jared Wiltshire
 * @exports mango/HTMLDisplay
 * @module {PointValueDataProvider} mango/PointValueDataProvider
 * @augments DataProvider
 * @see PointValueDataProvider
 */

define(['jquery', './dataProvider'], function($, DataProvider) {
"use strict";


/**
 * @constructs PointValueDataProvider
 * @param {number|string} id - ID For provider
 * @param {Object} options - options for provider
 * @augments DataProvider
 */
function PointValueDataProvider(id, options) {
	DataProvider.apply(this, arguments);
}
    
PointValueDataProvider.prototype = Object.create(DataProvider.prototype);

/**
 * Type of Data Provider
 * @type {string}
 * @default 'PointValueDataProvider'
 * @const
 */
PointValueDataProvider.prototype.type = 'PointValueDataProvider';

/**
 * Used to limit the maximum amount of values that will be returned.
 * If more than this, the too much data method will be called.
 * @see PointValueDataProvider#tooMuchData
 * @type {number}
 * @default 5000
 */
PointValueDataProvider.prototype.maxPointValueCount = 5000;
    
/**
 * @param {Object} changedOptions - What options have changed
 * @returns {boolean} - Should we reload our data
 */
PointValueDataProvider.prototype.needsToLoad = function(changedOptions) {
    if (changedOptions.from || changedOptions.to || changedOptions.rollup ||
            changedOptions.timePeriodType || changedOptions.timePeriods)
        return true;
    return false;
};

/**
 * Load a point's data
 * @param {DataPoint} point - Data Point To load
 * @param {Object} options - Rollup, dates, etc.
 */
PointValueDataProvider.prototype.loadPoint = function(point, options) {
    var apiOptions = $.extend({}, this.apiOptions, {
        rollup: options.rollup,
        timePeriodType: options.timePeriodType,
        timePeriods: options.timePeriods
    });
    
    return this.tryLoadPoint(point, options);
};

/**
 * Check to see if we have too much data to load
 */
PointValueDataProvider.prototype.tryLoadPoint = function(point, options){
    var self = this;
	return this.mangoApi.countValues(point.xid, options.from, options.to, options).then(function(count){
	    var deferred;
		if(count === 0){
		    deferred = $.Deferred();
			deferred.resolve({data: [], point: point});
			self.noData(options);
			return deferred.promise();
		}else if(count <= self.maxPointValueCount){
			return self.mangoApi.getValues(point.xid, options.from, options.to, options);
		}else{
            deferred = $.Deferred();
			deferred.resolve({data: [], point: point});
			self.tooMuchData(count, self.maxPointValueCount);
			return deferred.promise();
		}
	});
};

/**
 * Called when too much data is going to be returned.
 * @param {number} amount - Count of point values that would have been returned
 * @param {limit} limit - Maximum amount this provider allows
 */
PointValueDataProvider.prototype.tooMuchData = function(amount, limit){
    // TODO J.W. alert is nasty
	alert('Cannot Display ' + amount + ' point values.  Maximum is: ' + limit);
};

/**
 * Called when no much data is going to be returned.
 * @param {Object} options - Request options
 */
PointValueDataProvider.prototype.noData = function(options){
    // TODO J.W. alert is nasty
	alert('No Data in range: ' + options.from + " to " + options.to);
};

DataProvider.registerProvider(PointValueDataProvider);

return PointValueDataProvider;

}); // close define
