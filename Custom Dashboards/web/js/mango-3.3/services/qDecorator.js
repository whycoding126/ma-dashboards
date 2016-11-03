/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

qDecorator.$inject = ['$delegate'];
function qDecorator($delegate) {
    function decoratePromise(promise) {
        var then = promise.then;
        promise.then = function() {
            var nextPromise = then.apply(this, arguments);
            if (typeof promise.cancel === 'function') {
                nextPromise.cancel = promise.cancel;
            }
            return decoratePromise(nextPromise);
        };
        
        promise.setCancel = function setCancel(cancel) {
            if (typeof cancel === 'function') {
                this.cancel = cancel;
            }
            return this;
        };
        
        return promise;
    }

    var defer = $delegate.defer;
    var when = $delegate.when;
    var reject = $delegate.reject;
    var all = $delegate.all;
    var race = $delegate.race;
    
    $delegate.defer = function() {
        var deferred = defer.apply(this, arguments);
        decoratePromise(deferred.promise);
        return deferred;
    };
    $delegate.when = function() {
        var p = when.apply(this, arguments);
        return decoratePromise(p);
    };
    $delegate.reject = function() {
        var p = reject.apply(this, arguments);
        return decoratePromise(p);
    };
    $delegate.all = function() {
        var p = all.apply(this, arguments);
        p.cancel = cancelAll.apply(null, arguments);
        return decoratePromise(p);
    };
    $delegate.race = function() {
        var p = race.apply(this, arguments);
        p.cancel = cancelAll.apply(null, arguments);
        return decoratePromise(p);
    };
    
    function cancelAll() {
        var promises = Array.prototype.slice.apply(arguments);
        return function() {
            for (var i = 0; i < promises.length; i++) {
                if (typeof promises[i].cancel === 'function') {
                    promises[i].cancel.apply(promises[i], arguments);
                }
            }
        }
    }

    return $delegate;
}

return qDecorator;

});
