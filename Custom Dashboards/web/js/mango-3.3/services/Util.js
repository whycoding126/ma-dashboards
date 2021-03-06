/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'moment-timezone'], function(angular, moment) {
'use strict';
/**
* @ngdoc service
* @name maServices.Util
*
* @description
* Provides  various utility functions that can be used in other directives and services.
*
* # Usage
*
* <pre prettyprint-mode="javascript">
    var changedXids = Util.arrayDiff(newValue.xids, oldValue.xids);
* </pre>
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name arrayDiff
*
* @description
* Utility for providing information about the difference between two arrays
* @param {array} newArray New array to compare against old array.
* @param {array} oldArray Old array that new array will compare against.
* @returns {object}  Returns an object with the following properties:

<ul><li>`added` - ARRAY of items that were added in newArray that were not in oldArray.</li>
<li>`removed` - ARRAY of items that were in oldArray that were not in newArray.</li>
<li>`changed` - BOOLEAN true/false depending on if there is a diff between the arrays.
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name toMoment
*
* @description
* Converts an input to a momentjs object
* @param {string} input If input = 'now', moment(now) will be returned
* @param {string} now standard date timestamp for converting to moment
* @param {string} format If input equals a formatted date/time string, specify what format it is in to return moment(input, format || mangoDefaultDateFormat);
* @returns {object}  Returns a moment js object.

*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name isEmpty
*
* @description
* Test a string for null, undefined or whitespace
* @param {string} str String to be tested for emptiness
* @returns {boolean}  Returns true if `str` is null, undefined, or whitespace
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name numKeys
*
* @description
* Number of keys in object starting with specified string
* @param {object} obj Object containing a certain number of items.
* @param {string} start String used for testing keys
* @returns {number}  Returns the number of keys in `obj` starting with the text given by `start` string
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name cancelAll
*
* @description
* remove all elements from cancelFns array so cancel fns are never called again
* @param {array} cancelFns Array of functions to be cancelled
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name openSocket
*
* @description
* If websocket is supported by the browser this utility will open a new websocket at the specified path.
* @param {string} path Path of the API endpoint to open a websocket connection with
* @returns {object}  Returns a WebSocket object at the specifed path
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name transformArrayResponse
*
* @description
* Parses an array response from a Mango endpoint which contains a total
* and assigns it as the property $total on the array
* @param {json} data array response from Mango endpoint
* @param {string} fn REPLACE
* @param {number} code String used for testing keys
* @returns {array}  Array with $ total appended
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name arrayResponseInterceptor
*
* @description
* Copies the total from the transformed array onto the actual destination
* array and computes page number
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name memoize
*
* @description
* Extremely simple memoize function that works on === equality.
* Used to prevent infinite digest loops in filters etc.
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name uuid
*
* @description
* REPLACE
*
*/

/**
* @ngdoc method
* @methodOf maServices.Util
* @name rollupIntervalCalculator
*
* @description
* Calculates rollup intervals based on time duration and rollup type
* @param {string} from From Time
* @param {string} to To Time
* @param {string} rollupType Rollup Type (DELTA, AVERAGE etc.)
* @returns {string} Returns a string holding the Rollup Interval (eg. `1 MINUTES`)
*
*/

function UtilFactory(mangoBaseUrl, mangoDefaultDateFormat, $q) {
	function Util() {}

	/**
	 * @return difference object
	 */
	Util.prototype.arrayDiff = function arrayDiff(newArray, oldArray) {
    	if (newArray === undefined) newArray = [];
    	if (oldArray === undefined) oldArray = [];

    	var added = angular.element(newArray).not(oldArray);
    	var removed = angular.element(oldArray).not(newArray);

    	return {
    		added: added,
    		removed: removed,
    		changed: !!(added.length || removed.length)
    	};
    };

    /**
     * Converts input to a moment
     */
    Util.prototype.toMoment = function toMoment(input, now, format) {
        if (!input || input === 'now') return moment(now);
        if (typeof input === 'string') {
        	return moment(input, format || mangoDefaultDateFormat);
        }
        return moment(input);
    };

    /**
     * test for null, undefined or whitespace
     */
    Util.prototype.isEmpty = function isEmpty(str) {
    	return !str || /^\s*$/.test(str);
    };

    /**
     * @return Number of keys in object starting with xxx
     */
    Util.prototype.numKeys = function numKeys(obj, start) {
    	var count = 0;
    	for (var key in obj) {
    		if (key.indexOf(start) === 0) count++;
    	}
    	return count;
    };


    Util.prototype.cancelAll = function cancelAll(cancelFns) {
    	// remove all elements from cancelFns array so cancel fns are never called again
    	cancelFns = cancelFns.splice(0, cancelFns.length);
    	for (var i = 0; i < cancelFns.length; i++)
    		cancelFns[i]();
    };

    Util.prototype.openSocket = function openSocket(path) {
        if (!('WebSocket' in window)) {
            throw new Error('WebSocket not supported');
        }

        var host = document.location.host;
        var protocol = document.location.protocol;

        if (mangoBaseUrl) {
            var i = mangoBaseUrl.indexOf('//');
            if (i >= 0) {
                protocol = mangoBaseUrl.substring(0, i);
                host = mangoBaseUrl.substring(i+2);
            }
            else {
                host = mangoBaseUrl;
            }
        }

        protocol = protocol === 'https:' ? 'wss:' : 'ws:';

        return new WebSocket(protocol + '//' + host + path);
    };

    /**
     * Parses an array response from a Mango endpoint which contains a total
     * and assigns it as the property $total on the array
     */
    Util.prototype.transformArrayResponse = function transformArrayResponse(data, fn, code) {
        try {
            if (!data) return data;
            var parsed = angular.fromJson(data);
            if (code < 300) {
                parsed.items.$total = parsed.total || parsed.items.length;
                return parsed.items;
            }
            return parsed;
        } catch (error) {
            console.log(error);
        }
    };

    /**
     *  Copies the total from the transformed array onto the actual destination
     *  array and computes page number
     */
    Util.prototype.arrayResponseInterceptor = function arrayResponseInterceptor(data) {
        if (angular.isUndefined(data.data))
            return $q.reject(data);
        
        try {
            var start = 0;
            var limit = data.resource.length;
            var total = data.data.$total;
    
            var matches = /(?:&|\?)limit\((\d+)(?:,(\d+))?\)/i.exec(data.config.url);
            if (matches) {
                limit = parseInt(matches[1], 10);
                if (matches[2]) {
                    start = parseInt(matches[2], 10);
                }
            }
    
            data.resource.$start = start;
            data.resource.$limit = limit;
            data.resource.$total = total;
            data.resource.$pages = Math.ceil(total / limit);
            data.resource.$page = Math.floor(start / limit) + 1;
        }
        catch (error) {
            console.log(error);
            return $q.reject(data);
        }
        return data.resource;
    };

    /**
     * Extremely simple memoize function that works on === equality
     * Used to prevent infinite digest loops in filters etc
     */
    Util.prototype.memoize = function memoize(fn, cacheSize) {
        var cache = [];
        cacheSize = cacheSize || 10;
        do {
            cache.push(undefined);
        } while (--cacheSize > 0);

        return function() {
            var args = Array.prototype.slice.call(arguments, 0);

            searchCache: for (var i = 0; i < cache.length; i++) {
                var cacheItem = cache[i];
                if (!cacheItem) break;

                var cachedArgs = cacheItem.input;
                if (cachedArgs.length !== args.length) continue;

                for (var j = 0; j < cachedArgs.length; j++) {
                    if (cachedArgs[j] !== args[j]) continue searchCache;
                }

                return cacheItem.output;
            }

            var result = fn.apply(null, args);

            cache.unshift({input: args, output: result});
            cache.pop();

            return result;
        };
    };

    Util.prototype.uuid = function uuid() {
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-"
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    };
	

    Util.prototype.rollupIntervalCalculator = function rollupIntervalCalculator(from, to, rollupType, asObject) {

		var duration = moment(to).diff(moment(from));
		var result = {intervals: 1, units: 'SECONDS'};
		
		// console.log(duration,moment.duration(duration).humanize(),rollupType);
		
		if (duration > 60001 && duration <= 300001) {
			// 1 min - 5 mins
		    result = {intervals: 5, units: 'SECONDS'};
		}
		else if (duration > 300001 && duration <= 900001) {
			// 5 min - 15 mins
            result = {intervals: 10, units: 'SECONDS'};
		}
		else if (duration > 900001 && duration <= 1800001) {
			// 15 min - 30 mins
            result = {intervals: 30, units: 'SECONDS'};
		}
		else if (duration > 1800001 && duration <= 10800001) {
			// 30 mins - 3 hours
			if (rollupType == 'DELTA') {
	            result = {intervals: 5, units: 'MINUTES'};
			}
			else {
                result = {intervals: 1, units: 'MINUTES'};
			}
		}
		else if (duration > 10800001 && duration <= 21600001) {
			// 3 hours - 6 hours
			if (rollupType == 'DELTA') {
                result = {intervals: 30, units: 'MINUTES'};
			}
			else {
                result = {intervals: 2, units: 'MINUTES'};
			}
		}
		else if (duration > 21600001 && duration <= 86400001) {
			// 6 hours - 24 hours
			if (rollupType == 'DELTA') {
                result = {intervals: 1, units: 'HOURS'};
			}
			else {
                result = {intervals: 10, units: 'MINUTES'};
			}
		}
		else if (duration > 86400001 && duration <= 259200001) {
			// 1 day - 3 days
			if (rollupType == 'DELTA') {
                result = {intervals: 6, units: 'HOURS'};
			}
			else {
                result = {intervals: 30, units: 'MINUTES'};
			}
		}
		else if (duration > 259200001 && duration <= 604800001) {
			// 3 days - 1 week
			if (rollupType == 'DELTA') {
                result = {intervals: 12, units: 'HOURS'};
			}
			else {
                result = {intervals: 2, units: 'HOURS'};
			}
		}
		else if (duration > 604800001 && duration <= 1209600001) {
			// 1 week - 2 weeks
			if (rollupType == 'DELTA') {
                result = {intervals: 1, units: 'DAYS'};
			}
			else {
                result = {intervals: 3, units: 'HOURS'};
			}
		}
		else if (duration > 1209600001 && duration <= 2678400001) {
			// 2 weeks - 1 month
			if (rollupType == 'DELTA') {
                result = {intervals: 1, units: 'DAYS'};
			}
			else {
                result = {intervals: 4, units: 'HOURS'};
			}
		}
		else if (duration > 2678400001 && duration <= 15721200001) {
			// 1 month - 6 months
			if (rollupType == 'DELTA') {
                result = {intervals: 1, units: 'WEEKS'};
			}
			else {
                result = {intervals: 24, units: 'HOURS'};
			}
		}
		else if (duration > 15721200001 && duration <= 31622400001) {
			// 6 months - 1 YR
			if (rollupType == 'DELTA') {
                result = {intervals: 2, units: 'WEEKS'};
			}
			else {
                result = {intervals: 48, units: 'HOURS'};
			}
		}
		else if (duration > 31622400001) {
			// > 1 YR
			if (rollupType == 'DELTA') {
                result = {intervals: 1, units: 'MONTHS'};
			}
			else {
                result = {intervals: 96, units: 'HOURS'};
			}
		}
		// console.log(rollupInterval);
		
		if (asObject) {
		    return result;
		} else {
		    return result.intervals + ' ' + result.units;
		}
    };
    
    Util.prototype.objQuery = function objQuery(options) {
        if (!options) return this.query();

        var params = [];
        if (typeof options.query === 'string' && options.query) {
            params.push(options.query);
        } else if (options.query) {
            var and = !!options.query.$and;
            var exact = !!options.query.$exact;
            delete options.query.$exact;
            delete options.query.$and;

            var parts = [];
            for (var key in options.query) {
                var val = options.query[key] || '';
                var comparison = '=';
                var autoLike = false;
                if (val.indexOf('=') < 0 && !exact) {
                    comparison += 'like=*';
                    autoLike = true;
                }
                parts.push(key + comparison + val + (autoLike ? '*': ''));
            }

            var queryPart;
            if (and || parts.length === 1) {
                queryPart = parts.join('&');
            } else {
                queryPart = 'or(' + parts.join(',') + ')';
            }
            params.push(queryPart);
        }

        if (options.sort) {
            var sort = options.sort;
            if (angular.isArray(sort)) {
                sort = sort.join(',');
            }
            params.push('sort(' + sort + ')');
        }

        if (options.limit) {
            var start = options.start || 0;
            params.push('limit(' + options.limit + ',' + start + ')');
        }

        return params.length ? this.query({rqlQuery: params.join('&')}) : this.query();
    };
    
    Util.prototype.parseInternationalFloat = function parseInternationalFloat(strValue) {
        strValue = standardizeFloat(strValue);
        return parseFloat(strValue);
        
        function standardizeFloat(strValue) {
            var matches;

            // has obvious space or full stop thousands separator and a comma as radix point
            // i.e. converts 1 234 567,89 to 1234567.89
            if (matches = /\b(\d{1,3}(?:[\. ]\d{3})+),(\d+)/.exec(strValue)) {
                return matches[1].replace(/[\. ]/g, '') + '.' + matches[2];
            }
            
            // convert groups of digits with 2 or more full stop thousands separators
            // i.e. converts 1.234.567 to 1234567
            if (matches = /\b\d{1,3}(?:\.\d{3}){2,}(?!\d)/.exec(strValue)) {
                return matches[0].replace(/\./g, '');
            }

            // remove any other commas, spaces and single quotes (can be thousands separators)
            strValue = strValue.replace(/[, ']/g, '');
            
            if (matches = /[-+\.\d]+/.exec(strValue)) {
                return matches[0];
            }

            return strValue;
        }
    };

    return new Util();
}

UtilFactory.$inject = ['mangoBaseUrl', 'mangoDefaultDateFormat', '$q'];
return UtilFactory;

}); // define
