/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'angular'], function(require, angular) {
'use strict';

pointValuesFactory.$inject = ['$http', '$q', '$timeout', 'Util', 'mangoTimeout'];
function pointValuesFactory($http, $q, $timeout, Util, mangoTimeout) {
    var pointValuesUrl = '/rest/v1/point-values/';

    function PointValues() {
    }
    
    PointValues.prototype.getPointValuesForXid = function getPointValuesForXid(xid, options) {
        try {
            if (!angular.isString(xid)) throw new Error('Requires xid parameter');
            if (!angular.isObject(options)) throw new Error('Requires options parameter');
            
            var url = pointValuesUrl + encodeURIComponent(xid);
            var params = [];
            var reverseData = false;
            
            if (options.latest) {
                url += '/latest';
                params.push('limit=' + encodeURIComponent(options.latest));
                reverseData = true;
            } else if (!angular.isUndefined(options.from) && !angular.isUndefined(options.to)) {
                var now = new Date();
                var from = Util.toMoment(options.from, now, options.dateFormat);
                var to = Util.toMoment(options.to, now, options.dateFormat);
                
                if (from.valueOf() === to.valueOf()) {
                    return $q.when([]).setCancel(angular.noop);
                }
                
                params.push('from=' + encodeURIComponent(from.toISOString()));
                params.push('to=' + encodeURIComponent(to.toISOString()));
                
                if (angular.isString(options.rollup) && options.rollup !== 'NONE') {
                    params.push('rollup=' + encodeURIComponent(options.rollup));
    
                    var timePeriodType = 'DAYS';
                    var timePeriods = 1;
    
                    if (angular.isString(options.rollupInterval)) {
                        var parts = options.rollupInterval.split(' ');
                        if (parts.length === 2 && angular.isString(parts[0]) && angular.isString(parts[1])) {
                            timePeriods = parseInt(parts[0], 10);
                            if (!isFinite(timePeriods) || timePeriods <= 0) {
                                throw new Error('options.rollupInterval must be a finite number > 0');
                            }
                            timePeriodType = parts[1].toUpperCase();
                        } else {
                            throw new Error('Error parsing options.rollupInterval');
                        }
                    } else if (isFinite(options.rollupInterval) && options.rollupInterval > 0) {
                        timePeriods = options.rollupInterval;
                    } else {
                        throw new Error('options.rollupInterval must be a string or finite number > 0');
                    }
                    
                    if (!angular.isUndefined(options.rollupIntervalType)) {
                        if (!angular.isString(options.rollupIntervalType) || Util.isEmpty(options.rollupIntervalType)) {
                            throw new Error('Invalid options.rollupIntervalType');
                        }
                        timePeriodType = options.rollupIntervalType;
                    }
    
                    params.push('timePeriodType=' + encodeURIComponent(timePeriodType));
                    params.push('timePeriods=' + encodeURIComponent(timePeriods));
                }
            } else {
                throw new Error('Requires options.to and options.from or options.latest');
            }
            
            if (options.rendered) {
                params.push('useRendered=true');
            }
            
            url += '?' + params.join('&');
            
            var canceler = $q.defer();
            var timeoutPromise;
            var timeout = isFinite(options.timeout) ? options.timeout : mangoTimeout;
            if (timeout > 0) {
                timeoutPromise = $timeout(null, timeout);
            }
            
            return $http.get(url, {
                timeout: timeoutPromise ? $q.race(canceler.promise, timeoutPromise) : canceler.promise,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                if (!response || !angular.isArray(response.data)) {
                    throw new Error('Incorrect response from REST end point ' + url);
                }
                var values = response.data;
                if (reverseData)
                    values.reverse();
                return values;
            }).setCancel(canceler.resolve);
        } catch (error) {
            return $q.reject(error).setCancel(angular.noop);
        }
    };

    return new PointValues();
}

return pointValuesFactory;
});
