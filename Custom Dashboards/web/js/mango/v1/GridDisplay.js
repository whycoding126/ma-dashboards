/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery', 'extend', 'dojo/_base/declare', 'dstore/Memory', 'dstore/Trackable', 'dgrid/OnDemandGrid'],
function($, extend, declare, Memory, Trackable, OnDemandGrid) {

var GridDisplay = extend({
    constructor: function(options) {
        this.store = new declare([Memory, Trackable])({
            data: [],
            idProperty: 'timestamp'
        });
        this.gridOptions = {
            collection: this.store
        };
        
        $.extend(this.gridOptions, options.gridOptions);
        delete options.gridOptions;
        $.extend(this, options);
    },
    
    createDisplay: function() {
        this.grid = new OnDemandGrid(this.gridOptions, this.gridId);
        return this;
    },
    
    /**
     * Data Provider listener to clear data
     */
    onClear: function() {
        this.store.setData([]);
        this.grid.refresh();
    },
    
    /**
     * Data Provider Listener
     * On Data Provider load we add new data
     */
    onLoad: function(data, dataPoint) {
        if ($.isArray(data)) {
            this.store.setData(data);
            this.grid.refresh();
        }
        else {
            this.store.put(data);
        }
    },
    
    loading: function() {
        
    },
    
    removeLoading: function() {
        
    }
});

return GridDisplay;

}); // define
