/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['moment-timezone'], function(moment) {
'use strict';
/**
 * @ngdoc filter
 * @name maFilters.moment
 *
 * @description
 * Converts a timetamp to a <a href="http://momentjs.com/" target="_blank">momentJS</a> object that can be
 formatted and manipulated.
 * - Moment methods can be called using the filter syntax to call functions: 
 *      - <code ng-non-bindable>Three days from now is {{'now' | moment:'add':3:'days' | moment:'format':'LLL'}}</code>
 *      - <code ng-non-bindable>{{myPoint.time | moment:'format':'ll LTS'}}</code>
 * - <a ui-sref="dashboard.examples.basics.filters">View Filters Demo</a>
 */
function momentFilter(Util) {
    return Util.memoize(function(input, fnName) {
        var m;
        if (!input || (typeof input === 'string' && input.toLowerCase().trim() === 'now')) {
            m = moment().milliseconds(0);
        } else {
            m = moment(input);
        }
        if (!m.isValid()) {
            return input;
        }
        var fnArgs = Array.prototype.slice.call(arguments, 2);
        var fn = m[fnName];
        if (typeof fn !== 'function') return input;
        return fn.apply(m, fnArgs);
    });
}

momentFilter.$inject = ['Util'];
return momentFilter;

}); // define
