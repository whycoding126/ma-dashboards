/**
 * Javascript code for the dynamicDashboard.shtm page
 * 
 * This page uses the Point Hierarchy to create dashboards
 * 
 * The GroupConfigs are settings to break points into groups in the drop down menu
 * 
 * The pointConfigs are the settings that must exist for ALL points in the drop down menu
 * 
 * There can be multiple point configs for 1 point, this will generate multiple charts/statistics/etc for each point
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */



//Global Chart Configurations
var gaugeConfig;
var lineConfig;
var pointConfigs = new Array();
var pointGroups = new Array();
var root; //Point Hierarchy Root 
var allDataPointSummaries = new Array(); //Holds all data points in Mango
var pointHierarchyMap = {}; //Map of folder IDs to Folder

//Customize Your Point Groupings Here to group via Point Hierarchy
var groupConfigs = [
        {   //One group of all points
            matchAll: true,
            byFolder: false,
            byPointSummary: false,
            matchConfig: {
                label: "All Points",
            }
        },
        {   //Group ALL by folder name
            matchAll: false,
            byFolder: true,
            byPointSummary: false,
            matchConfig: {
                label: null, //Use attribute to generate labels
                labelAttribute: "name", //Options are name or path
                matchAttribute: "name",
                startsWith: null,
                endsWith: null,
                    
            }
            
        },
        {   //Group ALL by folder using a label (useful for finding 1 group)
            matchAll: false,
            byFolder: true,
            byPointSummary: false,
            matchConfig: {
                label: "Starts With N", //Use attribute to generate labels
                labelAttribute: null,
                matchAttribute: "name",
                startsWith: "N",
                endsWith: null,
                    
            }
            
        },
        {   //Group ALL by point summary using device name
            matchAll: false,
            byFolder: false,
            byPointSummary: true,
            matchConfig: {
                label: null, //Use attribute to generate labels
                labelAttribute: "deviceName",
                matchAttribute: "deviceName",
                startsWith: null,
                endsWith: null,
                    
            }
            
        },
        {   //Group ALL by point summary using device name starting with D
            matchAll: false,
            byFolder: false,
            byPointSummary: true,
            matchConfig: {
                label: null, //Use attribute to generate labels
                labelAttribute: "deviceName",
                matchAttribute: "deviceName",
                startsWith: "D",
                endsWith: null,
                    
            }
            
        },
        {   //Group ALL by subfolder's of a folder, use static label
            // Caution, if multiple groups are found then they will all have the same label
            matchAll: false,
            byFolder: true,
            byPointSummary: false,
            matchConfig: {
                label: "found",
                labelAttribute: null,
                matchAttribute: "path",
                startsWith: "Numeric/",
                endsWith: null,
            }
            
        },
        {   //Group ALL by subfolder's of a folder
            matchAll: false,
            byFolder: true,
            byPointSummary: false,
            matchConfig: {
                label: null, //Use attribute to generate labels
                labelAttribute: "name",
                matchAttribute: "path",
                startsWith: "Numeric/",
                endsWith: null,
            }
            
        },
        {   //Group ALL by subfolder's of a folder
            matchAll: false,
            byFolder: true,
            byPointSummary: false,
            matchConfig: {
                label: null, //Use attribute to generate labels
                labelAttribute: "path",
                matchAttribute: "path",
                startsWith: null,
                endsWith: null,
            }
            
        },
  ];

//Customize Your Points Here
var numericPointOverrides = [
        {
            nameEndsWith: "in F",
            chart: {
                divId: "temperatureChart",
                title: "Temperature",
                pastPointCount: 25,
                realtime: true,
                valueAxis: {
                    title: "Degrees F"
                },            
                graph: {
                    balloonText: "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    bullet: "round",
                    bulletSize: 6,
                    lineColor: "#d1655d",
                    lineThickness: 2,
                    negativeLineColor: "#637bb6",
                    type: "smoothedLine",
                }
                
            },
            statistics: {
                averageId: "temperatureAverage",
                integralId: "temperatureIntegral",
                sumId: "temperatureSum",
                firstId: "temperatureFirst",
                lastId: "temperatureLast",
                countId: "temperatureCount",
                minimumId: "temperatureMinimum",
                maximumId: "temperatureMaximum"
                
            }
        },
        {
            nameEndsWith: "in F",

            chart: {
                type: "gauge",
                divId: "temperatureGauge",
                title: "Temperature",
                config: "simpleGauge.json",
                units: "Degrees F",
                realtime: true,
                includeInSummary: false
            }
        },
        {
            nameEndsWith: "volts",
            chart: {
                divId: "voltageChart",
                title: "Voltage",
                valueAxis: {
                    title: "Volts"
                },
                graph: {
                    balloonText: "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    bullet: "square",
                    bulletSize: 6,
                    lineColor: "green",
                    lineThickness: 1,
                    negativeLineColor: "red",
                    type: "step",
                }
            }
        }
  ];

var templater; //The Core Templating Object
/*
 * At page load setup the divs
 */
$( document ).ready(function(){

    //Setup Time Picker
    $('#startDate').datetimepicker({
        inline:true,
        onChangeDateTime:setStartDate,
    });
    $('#endDate').datetimepicker({
        inline:true,
        onChangeDateTime:setEndDate,
    });
    //First load the point Hierarchy to use on the page
    mangoRest.hierarchy.getRoot(function(data){
        
        //Create the Templater
        templater = new MangoPointHierarchyTemplate(
                {
                    root: data,
                    summaryChartId: "summary",
                    errorDivId: "errors",
                    groupConfigs: groupConfigs,
                    decimalPlaces: 2
                }
                
            );

        //Search for all points and save into a list
        templater.loadAllPoints();
        
        
        //Load the point hierarchy into some select lists
        templater.createAllFoldersDropDown('allFolders');
        templater.createGroupDropDown('groups');
        
        //TODO Chain these together so we are sure they are done prior to UI Engagement
        //Load in the Chart Configurations
        mangoRest.getJson("/modules/dashboards/web/private/charts/simpleGauge.json", function(data){
            gaugeConfig = data;
        }, showError);
        
        templater.loadNumericPointConfigs(numericPointOverrides);
        
//        mangoRest.getJson("/modules/dashboards/web/private/points/simpleMultistate.json", function(data){
//          //Modify the configuration for your page here
//            
//            pointConfigs.push(data);
//        }, showError);  
        
        
    }, showError);
    
});

function setStartDate(date){
    alert(date);
}
function setEndDate(date){
    alert(date);
}
/**
 * Helper to display error messages in the error div
 * @param jqXHR - xhr response
 * @param textStatus - status from response
 * @param errorThrown - exception
 * @mangoMessaage - string response from Mango
 */
function showError(jqXHR, textStatus, errorThrown, mangoMessage){

    var msg = "";
    if(textStatus != null)
        msg += (textStatus + " ");
    if(errorThrown != null)
        msg += (errorThrown + " ");
    if(mangoMessage != null)
        msg += (mangoMessage + " ");
    msg += "\n";
    $("#" + this.errorDivId).text(msg);
}