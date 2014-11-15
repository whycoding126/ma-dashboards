/**
 * Javascript Object for the Matching Data Points from a list.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * Used for matching
 */
DataPointMatchConfiguration = function(providerId, matchConfigurations, options){
    this.providerId = providerId;
    this.providerType = 'PointValue';
    this.matchConfigurations = matchConfigurations;
    
    for(var i in options) {
        this[i] = options[i];
    }
    if((typeof this.matchConfigurations == 'undefined')||(this.matchConfigurations == null)){
        this.matchConfigurations = new Array();
    }
    
};

DataPointMatchConfiguration.prototype = {
        matchConfigurations: null, //Array of PointMatchConfigurations

        timeAttribute: null, //Leave null to use timestamp
        valueAttribute: null, //Leave null to use matched point xid
        
        providerId: null,
        providerType: null, //['PointValue', 'Statistics']

        /**
         * Operation for getting a Value
         */
        valueOperation: function(processedData, pvt, xid){
            return pvt.value.toFixed(2);
        },
        /**
         * Operation for getting the time
         */
        timeOperation: function(processedData, pvt, xid){
            return pvt.timestamp;
        },
};

PointMatchConfiguration = function(matchAttribute, regex, options){
    this.matchAttribute = matchAttribute;
    this.regex = regex;
};

PointMatchConfiguration.prototype = {
    matchAttribute: null,
    regex: null, //Regex to match
};


/**
 * Data Point Configuration Uses a data point
 * and matches to a provider Id
 * @param point
 * @param providerId
 * @param options
 * @returns
 */
DataPointConfiguration = function(point, providerId, providerType, options){
    this.point = point;
    this.providerId = providerId;
    this.providerType = providerType; 
    
    for(var i in options) {
        this[i] = options[i];
    }
};

DataPointConfiguration.prototype = {
        point: null, //Data Point
        providerId: null, //Data Provider ID to add this to
        providerType: null, //Data Provider Type ['PointValue', 'Statistcs']
};

/**
 * The Mango Data Point Matcher will match points to thier configurations
 * 
 * 
 * @param dataPoints - list of {xid, name, dataSourceXid, deviceName, pointFolderId} (will not be modified)
 * @param configurations - list of Data Point Match Configurations to use
 * @param onMatch - method to call when a match is made, passing the dataPointConfiguration of the match
 * @param options - object of anything you want to override
 */
DataPointMatcher = function(configurations, onMatch, options){

    this.configurations = configurations;
    this.onMatch = onMatch;
    
    for(var i in options) {
        this[i] = options[i];
    }
};


DataPointMatcher.prototype = {
        
        owner: null, //Object to include in callbacks
        configurations: null, //List of point configurations
        matchAll: true, //Use all points that match a point configuration (or use first match)
        
        /**
         * Helper to add one configuration
         * @param dataPointMatchConfiguration - DataPointMatchConfiguration Object
         */
        addDataPointMatchConfiguration: function(dataPointMatchConfiguration){
            this.configurations.push(dataPointMatchConfiguration);
        },
        
        /**
         * Match each configuration to as many points as possible.  Then
         * return the list of DataPointConfiguration
         * 
         * This will clear out any data providers first
         * 
         * @param dataPoints data points summaries
         * @return - List of DataPointConfigurations
         */
        match: function(dataPoints){
            var matchedConfigurations = new Array();
            for(var i=0; i<this.configurations.length; i++){
                var configuration = this.configurations[i];
                for(var j=0; j<dataPoints.length; j++){
                    var point = dataPoints[j];
                    if(this.matchPointToConfiguration(point, configuration)){
                        //Matched, create/add to data provider
                        var dataPointConfiguration = new DataPointConfiguration(point,configuration.providerId, configuration.providerType);
                        this.onMatch(dataPointConfiguration, this.owner);
                        matchedConfigurations.push(dataPointConfiguration);
                        if(!this.matchAll)
                            break; //Break out if we are not matching all
                    }
                }
            }
            return matchedConfigurations;
        },
        
        /**
         * Called on match of point to configuration
         */
        onMatch: function(dataPointConfiguration, owner){
            //Do nothing unless overridden
        },
        
        /**
         * Match one point to one configuration.  If no matching attributes are set,
         * a match is assumed.
         * 
         * If more than one matching attribute is in the configuration they must all match.
         * 
         * @param point - data point
         * @param configuration - point configuration
         * @return - true if match, false if not
         */
        matchPointToConfiguration: function(point, configuration){
            var match = true;
            //Does this point match this template
            for(var i=0; i<configuration.matchConfigurations.length; i++){
                var matchConfig = configuration.matchConfigurations[i];
                if(point[matchConfig.matchAttribute].match(matchConfig.regex) != null)
                    match = true;
                else
                    match = false;
            }
            return match;
        },
        
};