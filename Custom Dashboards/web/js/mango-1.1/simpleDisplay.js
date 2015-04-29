/**
 * Javascript Objects for the Displaying Data on HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

define(['jquery'], function($) {
"use strict";

/**
 * Configuration for Base Display Objects
 * @constructs SimpleDisplayConfiguration
 * 
 * @param divId
 * @param dataProviderIds
 * @param mixin
 * @param options
 */
SimpleDisplayConfiguration = function(dataProviderIds, mangoDisplayMixin, options){

    this.dataProviderIds = dataProviderIds;
    this.mangoDisplayMixin = mangoDisplayMixin;

    
    for(var i in options) {
        this[i] = options[i];
    }
    
};

/**
 * @class SimpleDisplayConfiguration
 */
SimpleDisplayConfiguration.prototype = {
		
        /** @member {string} [divId=null] divId - Div for displaying information */
		divId: null,

        mangoDisplayMixin: null, //Any Mango Serial Chart mixins
        
        configuration: null, //The full config with mixin
       
        dataProviderIds: null, //List of my data provider ids
        
        displayLoading: function(){
            //Override as necessary
        },
        /**
         * Do the heavy lifting and create the item
         * @return {SimpleDisplay} created display
         */
        createDisplay: function(){
            this.displayLoading();
            var serial = new MangoSimpleDisplay(this.dataProviderIds);
            
            return $.extend(true, {}, serial, this.mangoDisplayMixin);
        }
        
};


/**
 * @constructs - Mango Simple Display
 * @param amChart
 * @param dataProviderIds
 * @param options
 */
MangoSimpleDisplay = function(dataProviderIds, dataPointMappings, options){
    this.dataProviderIds = dataProviderIds;
    this.dataPointMappings = dataPointMappings;
    
    for(var i in options) {
        this[i] = options[i];
    }
};

MangoSimpleDisplay.prototype = {
        
        /**
         * Data Provider listener to clear data
         */
        onClear: function(){
            //Override as necessary
        },
        
        /**
         * Data Provider Listener
         * On Data Provider load we add new data
         */
        onLoad: function(data, dataPoint){
            //Override as necessary
        }
        
};

//make the related sub types accessible through the returned type
//alternatively could make only visible internally or put them in separate files
SimpleDisplayConfiguration.MangoSimpleDisplay = MangoSimpleDisplay;

return SimpleDisplayConfiguration;

}); // close define