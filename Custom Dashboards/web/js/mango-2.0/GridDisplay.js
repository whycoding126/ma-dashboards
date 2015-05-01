/**
 * Grid Display using DStore
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 * @module {GridDisplay} mango/GridDisplay
 * @see GridDisplay
 */
define(['jquery', 'extend', 'dojo/_base/declare', 'dstore/Memory', 'dstore/Trackable', 'dgrid/OnDemandGrid'],
function($, extend, declare, Memory, Trackable, OnDemandGrid) {

/**
 * @constructs GridDisplay
 * @param {Object} options - options for grid
 */	
function GridDisplay(options){
    // stores data which arrives while loading
    this.cache = [];
    this.maximumItems = null;
    
    this.store = new declare([Memory, Trackable])({
        data: [],
        idProperty: 'timestamp'
    });
    this.gridOptions = {
        collection: this.store
    };
    
    $.extend(this.gridOptions, options.gridOptions);
    delete options.gridOptions;
    
    this.loadingMessage = this.gridOptions.loadingMessage;
    this.noDataMessage = this.gridOptions.noDataMessage;
    
    $.extend(this, options);
};	

/**
 * OnDemandGrid created by createDisplay
 * @type {OnDemandGrid}
 * @default null
 */
GridDisplay.prototype.grid = null;

/**
 * Data Cache
 * @type {Array}
 * @default []
 */
GridDisplay.prototype.cache = null;

/**
 * Maximum Items to display
 * @type {?number}
 * @default null
 */
GridDisplay.prototype.maximumItems = null;

/**
 * Data Store
 * @type {TrackableMemoryStore}
 */
GridDisplay.prototype.store = null;

/**
 * Options for Grid
 * @type {Object}
 * @default null
 */
GridDisplay.prototype.gridOptions = null

/**
 * Message displayed while loading data
 * @type {string}
 * @default gridOptions.loadingMessage
 */
GridDisplay.prototype.loadingMessage = null;
/**
 * Message displayed when no data is available
 * @type {string}
 * @default gridOptions.noDataMessage
 */
GridDisplay.prototype.noDataMessage = null;


/**
 * Create the Display
 */
GridDisplay.prototype.createDisplay = function() {
    this.grid = new OnDemandGrid(this.gridOptions, this.gridId);
    return this;
};

/**
 * Data Provider listener to clear data
 */
GridDisplay.prototype.onClear = function() {
    this.cache = [];
    this.grid.noDataMessage = this.noDataMessage;
    this.store.setData([]);
    this.grid.refresh();
};

/**
 * Data Provider Listener
 * On Data Provider load we add new data
 */
GridDisplay.prototype.onLoad = function(data, dataPoint) {
    if ($.isArray(data)) {
        this.removeLoading();
        this.store.setData(this.cache.concat(data));
        this.cache = [];
        this.trimItems();
        this.grid.refresh();
    }
    else {
        if (this.isLoading) {
            this.cache.push(data);
        }
        else {
            this.store.put(data);
            this.trimItems();
        }
    }
};

/**
 * Trim the size of the Grid if necessary
 */
GridDisplay.prototype.trimItems = function() {
    if (!this.maximumItems) return;
    
    var sortedStore = this.store.sort(this.store.idProperty);
    
    while (this.store.data.length > this.maximumItems) {
        var lowestIdItem = sortedStore.fetchRangeSync({start: 0, end: 1})[0];
        this.store.removeSync(lowestIdItem[this.store.idProperty]);
    }
};

/**
 * Display Loading message
 * Set state to loading
 * Refresh Grid
 */
GridDisplay.prototype.loading = function() {
    this.isLoading = true;
    this.grid.noDataMessage = this.loadingMessage;
    this.grid.refresh();
};

/**
 * Remove Loading Message
 */
GridDisplay.prototype.removeLoading = function() {
    this.isLoading = false;
    this.grid.noDataMessage = this.noDataMessage;
    // refresh is called straight after by onLoad()
};

return GridDisplay;

}); // define
