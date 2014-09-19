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
        {   //Create groups for every folder in the Point Hierarchy
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
            xidEndsWith: "temp",
            chart: {
                divId: "temperatureChart",
                title: "Temperature",
                pastPointCount: null, //Or number of previous samples to use 25,
                realtime: false,
                valueAxis: {
                    title: "Degrees F"
                },            
                dataOperation: function(allData, pvt ,xid){
                    var value = pvt.value * 0.01;
                    return value.toFixed(2);
                 },
                 timeOperation: function(allData, pvt, xid){
                   return pvt.time;  
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
                period: null, //Leave null to use templater dates (otherwise ms period prior to now)
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
            xidEndsWith: "temp",

            chart: {
                type: "gauge",
                divId: "temperatureGauge",
                title: "Temperature",
                config: "simpleGauge.json",
                units: "Degrees F",
                realtime: true,
                includeInSummary: false,
                //Optionally add a render value method
                renderValue: function(pvt){
                    return pvt.value.toFixed(this.decimalPlaces) + " " +  this.units;
                }
            }
        },
        {
            xidEndsWith: "volts",
            chart: {
                type: "line",
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
        },
        
        {
            xidEndsWith: "volts",
            chart: {
                type: "text", //Text Area Renderer type 
                divId: "voltageValue",
                realtime: true,
                includeInSummary: false,
                renderValue: function(pvt){
                    return pvt.value.toFixed(2) + " Volts";
                }
            },
            statistics: {
                period: 1000*60*60, //Leave null to use templater dates (otherwise ms period prior to now)
                averageId: "voltageAverage",
                integralId: "voltageIntegral",
                sumId: "voltageSum",
                firstId: "voltageFirst",
                lastId: "voltageLast",
                countId: "voltageCount",
                minimumId: "voltageMinimum",
                maximumId: "voltageMaximum"
                
            }
        }
        
  ];

var templater; //The Core Templating Object
/*
 * At page load setup the divs
 */
$( document ).ready(function(){


    //Create the initial dates
    var defaultEndDate = new Date(); //Now
    var defaultStartDate = new Date(defaultEndDate.getTime() - 1000*60*60); //One Hour Ago

    //Create the Templater
    templater = new MangoPointHierarchyTemplate(
            {
                //Optionally Include a summary chart (not fully working yet)
                summaryChartId: "summary",
                
                //Div to place any errors that occur internally
                errorDivId: "errors",
                
                //Default for point rendering
                decimalPlaces: 2,
                
                //Group Configurations
                groupConfigs: groupConfigs,
                
                //Numeric Point Configurations to use
                numericPoints: numericPointOverrides,
                
                //Use Only 1 of these either choose by Folder or by Group
                //allFoldersDropDownId: 'allFolders',
                groupsDropDownId: 'groups',
                
                //Divs to place the Date Pickers
                fromDateDivId: 'startDate',
                toDateDivId: 'endDate',
                
                dateInputInline: true,
                
                //Dates to default to
                fromDate: defaultStartDate,
                toDate: defaultEndDate,
                
                //Rollup Selection (only for charts)
                rollupSelectId: 'rollup', //Select id for rollup
                timePeriodTypeSelectId: 'timePeriodType', //Select id for Period Types
                timePeriodInputId: 'timePeriod' //Input Id for period
            }
            
        );
    
});
