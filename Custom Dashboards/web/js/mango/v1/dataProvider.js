/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

(function(factory) { // anonymous function
    // Support multiple module loading scenarios
    if (typeof define === 'function' && define.amd) {
        // AMD anonymous module
        define(['jquery', 'extend', './mangoApi'], factory);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        this.DataProvider = factory(jQuery, extend, mangoRest);
    }
}(function($, extend, mangoRest) { // factory function

var DataProvider = extend({
    /**
     * Data Provider constructor
     * @param id
     * @param options
     * @returns
     */
    constructor: function(id, options) {
        this.id = id;
        this.listeners = [];
        this.pointConfigurations = [];
        
        $.extend(this, options);
        
        if (this.enabled) {
            this.enable();
        }
    },
    
    type: 'DataProvider',
    id: null, //Unique ID for reference (use Alphanumerics as auto generated ones are numbers)
    pointConfigurations: null, //List of Points + configurations to use
    listeners: null, //Listeners to send new data when load() completes
    enabled: true,
    cancelLastLoad: true,
    clearOnLoad: true,
    
    /**
     * Optionally manipulate data.
     * 
     *  Send in this method in the options during object creation.
     * 
     * @param data - data returned from load()
     * @param point - corresponding point
     * @return manipulated data
     */
    manipulateData: function(data, point) {
        return data;
    },
    
    /**
     * Clear out our pointConfigurations if required
     * 
     * Signal to all Listeners to clear ALL their data
     * 
     * @param clearConfigurations - boolean to clear pointConfigurations too
     */
    clear: function(clearConfigurations) {
        if (clearConfigurations) {
            while (this.pointConfigurations.length > 0) {
                this.pointConfigurations.pop();
            }
            // ensures that next load() call actually loads
            if (this.previousOptions)
                delete this.previousOptions;
        }
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].onClear();
        }
    },
    
    needsToLoad: function(changedOptions) {
        return true;
    },
    
    /**
     * Load our data and publish to listeners
     * @param options - {from: date, to: date}
     * @param error - method to call on error
     * @return promise when done
     */
    load: function(options, error) {
        if (!this.enabled) {
            return rejectedPromise("disabled", "Data provider is not enabled");
        }
        
        // check if we should reload
        var changedOptions = this.changedOptions(this.previousOptions, options);
        if (!options.forceRefresh && !this.needsToLoad(changedOptions)) {
            return rejectedPromise("notNeeded", "Load is not needed");
        }
        
        this.previousOptions = options;
        
        if (this.clearOnLoad) {
            this.clear();
        }
        
        if (this.pointConfigurations.length > 0)
            this.notifyLoading();
        
        if (this.cancelLastLoad)
            this.cancelLoad();
        
        var promises = [];

        var self = this;
        $.each(this.pointConfigurations, function(i, configuration) {
            var point = configuration.point;
            var promise = self.loadPoint(point, options).then(function(data) {
                // filter promise so we supply point to promise.done
                return {data: data, point: point};
            });
            promises.push(promise);
        });

        var combinedPromise = this.lastLoadPromise = mangoRest.when(promises);
        
        // notify all listeners at once in order
        combinedPromise.done(function() {
            for (var i in arguments) {
                var resolved = arguments[i];
                self.notifyListeners(resolved.data, resolved.point);
            }
            self.redrawListeners();
        });
        
        if (typeof error == 'function') combinedPromise.fail(error);
        
        return combinedPromise;
    },
    
    loadPoint: function(options, point) {
        // fail. need to override
        var deferred = $.Deferred();
        deferred.reject(null, "invalid", "loadPoint() should be overridden");
        return deferred.promise();
    },
    
    cancelLoad: function() {
        if (this.lastLoadPromise &&
                this.lastLoadPromise.state() === 'pending' &&
                typeof this.lastLoadPromise.cancel === 'function') {
            this.lastLoadPromise.cancel();
        }
    },
    
    /**
     * Notifies the listeners of new data
     * @param the new data
     * @param the point that the data came from
     */
    notifyListeners: function(data, point) {
        // Optionally manipulate the data
        if (this.manipulateData !== null)
            data = this.manipulateData(data, point);

        // Inform our listeners of this new data
        for (var i=0; i<this.listeners.length; i++) {
            this.listeners[i].onLoad(data, point);
        }
    },
    
    /**
     * Tells listeners to redraw, if they support it
     */
    redrawListeners: function() {
        for (var i=0; i<this.listeners.length; i++) {
            if (typeof this.listeners[i].redraw === 'function')
                this.listeners[i].redraw();
        }
    },
    
    /**
     * Notifies the listeners that data is loading
     * @param
     */
    notifyLoading: function() {
        for (var i=0; i<this.listeners.length; i++) {
            if (typeof this.listeners[i].loading === 'function')
                this.listeners[i].loading();
        }
    },
    
    /**
     * Put Point Value - No Op For this class
     * 
     * @param options {
     *                  refresh: boolean to refresh displays,
     *                  value: PointValueTime Model
     *                 }
     * 
     * @param error - function(jqXHR, textStatus, errorThrown, mangoMessage)
     * 
     */
    put: function(options, error) {
        // no-op
    },
    
    /**
     * Add a listener who registers to know of our updates
     */
    addListener: function(dataProviderListener) {
        this.listeners.push(dataProviderListener);
    },
    
    removeListener: function(dataProviderListener) {
        var index = $.inArray(dataProviderListener, this.listeners);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    },
    
    removeAllListeners: function() {
        while(this.listeners.length > 0)
            this.listeners.pop();
    },
    
    disable: function() {
        this.enabled = false;
    },
    
    enable: function() {
        this.enabled = true;
    },
    
    /**
     * Add a data point configuration to our list
     * @return true if point was added, false if it already existed
     */
    addDataPoint: function(dataPointConfiguration) {
        if (!dataPointConfiguration)
            return false;
        
        //We only allow adding a Data Point Configuration once
        for(var i=0; i<this.pointConfigurations.length; i++){
            if(this.pointConfigurations[i].point.xid == dataPointConfiguration.point.xid)
                return false;
        }
        this.pointConfigurations.push(dataPointConfiguration);

        // ensures that next load() call actually loads
        delete this.previousOptions;

        return true;
    },
    
    addDataPoints: function(dataPointConfiguration) {
        for (var i in dataPointConfigurations) {
            this.addDataPoint(dataPointConfigurations[i]);
        }
    },
    
    changedOptions: function(a, b) {
        if (!a || !b) {
            return {
                    from: true,
                    to: true,
                    rollup: true,
                    timePeriodType: true,
                    timePeriods: true
            };
        }
        var result = {
            from: false,
            to: false,
            rollup: false,
            timePeriodType: false,
            timePeriods: false
        };
        if (!a.from || !b.from || a.from.valueOf() !== b.from.valueOf()) {
            result.from = true;
        }
        if (!a.to || !b.to || a.to.valueOf() !== b.to.valueOf()) {
            result.to = true;
        }
        if (a.rollup !== b.rollup) {
            result.rollup = true;
        }
        if (a.timePeriodType !== b.timePeriodType) {
            result.timePeriodType = true;
        }
        if (a.timePeriods !== b.timePeriods) {
            result.timePeriods = true;
        }
        return result;
    }
});

function rejectedPromise(reason, description) {
    var deferred = $.Deferred();
    deferred.reject(null, reason, description);
    return deferred.promise();
}

var providers = {};

DataProvider.registerProvider = function(provider) {
    providers[provider.prototype.type] = provider;
};

DataProvider.newProvider = function(type, id, options) {
    return new providers[type](id, options);
};

return DataProvider;

})); // close factory function and execute anonymous function