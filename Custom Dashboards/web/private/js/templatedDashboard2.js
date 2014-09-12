/**
 * Javascript code for the templatedDashboard2.shtm page
 * 
 * This page uses All data points to create dashboards
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

var pointConfigs = new Array();
var pointGroups = new Array();
var allDataPoints; //Holds all data points in Mango

/**
 * Create Group Drop Down List
 * @param divId - for group select list
 */
function createGroupDropDown(divId){
    $('#' + divId).append(
            $("<option></option>").text("Select One").val(0)
       )
    //First Load in all data points to use
    mangoRest.dataPoints.getAll(function(points){
        
        allDataPoints = points;
        
        for(i in groupConfigs){
            var groupConfig = groupConfigs[i];
            //Load in the Configuration
            mangoRest.getJson("/modules/dashboards/web/private/groups/simpleGroup.json", function(data){
                //Merge our config with a base one
                var extendedGroupConfig = {};
                $.extend(true, extendedGroupConfig, data, groupConfig);
                
                //Determine the label
                var groupLabel = groupConfig.label;
                var newGroup = new Array();
                if(extendedGroupConfig.matchAll){
                    //Use all points for this group
                    newGroup.push.apply(newGroup, allDataPoints);
                }else{
                    //Loop over all data points and create a group with them
                    
                    for(j in allDataPoints){
                        
                    }
                }
                if(newGroup.length > 0){
                    pointGroups.push(newGroup);
                    $('#' + divId).append(
                            $("<option></option>").text(groupLabel).val(pointGroups.length-1)
                       );
                }
            }, showError);
        }
    }, showError);
    

}