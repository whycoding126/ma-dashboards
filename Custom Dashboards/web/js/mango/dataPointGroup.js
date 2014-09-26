/**
 * Javascript Objects Used for Grouping Data Points
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * Group Label 
 * @param id
 * @param label
 * @param options
 * @returns
 */
GroupLabel = function(id, label, options){
    this.id = id;
    this.label = label;
    
    for(var i in options) {
        this[i] = options[i];
    }
}


DataPointGroupConfiguration = function(options){
    
    this.groupBy = 'All'; //When grouping by All if no label set it will be 'All'
    
    for(var i in options) {
        this[i] = options[i];
    }
    //Ensure we at least have an empty array
    if(this.matchConfigurations == null)
        this.matchConfigurations = new Array(); 
    
};

DataPointGroupConfiguration.prototype = {
       
    groupBy: null, //Options vary ['All', ... ... ...] see your Grouper for more info
    label: null, //Use directly for Group Label
    labelAttribute: null, //Optionally use a member to generate the label
    
    matchConfigurations: null, //List of GroupMatchConfiguration
        
};

GroupMatchConfiguration = function(matchAttribute, startsWith, endsWith, options){
    this.matchAttribute = matchAttribute;
    this.startsWith = startsWith;
    this.endsWith = endsWith;
};

GroupMatchConfiguration.prototype = {
    matchAttribute: null,
    startsWith: null,
    endsWith: null,
};

/**
 * Group of Data Points
 * @param label
 * @param dataPoints
 * @param options
 * @returns
 */
DataPointGroup = function(label, dataPoints, options){
    
    this.label = label;
    this.dataPoints = dataPoints;
    
    for(var i in options) {
        this[i] = options[i];
    }
};

DataPointGroup.prototype = {
        
        label: null, //Label for group
        dataPoints: null, //The list of DataPoint 
        
        
}