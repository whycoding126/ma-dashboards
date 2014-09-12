/**
 * Javascript code for the dynamicDashboard.shtm page
 * 
 * This page uses the Point Hierarchy to create dashboards
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
                labelAttribute: "name",
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


/*
 * At page load setup the divs
 */
$( document ).ready(function(){

    //First load the point Hierarchy to use on the page
    mangoRest.hierarchy.getRoot(function(data){
        
        //Save the root reference
        root = data;
        
        //Search for all points and save into a list
        loadAllPoints(root, allDataPointSummaries);
        
        
        //Load the point hierarchy
        createAllFoldersDropDown('allFolders');
        createGroupDropDown('groups');
        
        //TODO Chain these together so we are sure they are done prior to UI Engagement
        //Load in the Chart Configurations
        mangoRest.getJson("/modules/dashboards/web/private/charts/simpleGauge.json", function(data){
            gaugeConfig = data;
        }, showError);
        
        //Load in the Point Configurations for Numeric Points
        mangoRest.getJson("/modules/dashboards/web/private/points/simpleNumeric.json", function(data){
            for(i in numericPointOverrides)
                pointConfigs.push(createNewPointConfig(numericPointOverrides[i], data));
            
        }, showError);
        
//        mangoRest.getJson("/modules/dashboards/web/private/points/simpleMultistate.json", function(data){
//          //Modify the configuration for your page here
//            
//            pointConfigs.push(data);
//        }, showError);  
        
        
    }, showError);
    
  
    
});

/**
 * Using an existing point configuration and an override layer
 * create a new config for that point
 * 
 * @param overrides
 * @param config
 * @returns New Merged Point Configuration
 */
function createNewPointConfig(overrides, config){
    
    var newConfig = {};
    $.extend(true, newConfig, config, overrides);

    return newConfig;
}


/**
 * Create Group Drop Down List
 * @param divId - for group select list
 */
function createGroupDropDown(divId){
    $('#' + divId).append( $("<option></option>").text("Select One").val(0) );
    
    //Loop over all the configs and create groups
    for(i in groupConfigs){
        var groupConfig = groupConfigs[i];

        var newGroups = new Array();
        if(groupConfig.matchAll){ //Match All Points
            //Use all points for this group
            var newGroup = {
                    points: new Array(),
                    label: groupConfig.matchConfig.label
            };
            newGroup.points.push.apply(newGroup.points, allDataPointSummaries);
            newGroups.push(newGroup);
        }else{
            //Loop over all data points and create a group with them
            var groupsMap = {};
            for(j in allDataPointSummaries){
                var summary = allDataPointSummaries[j];
                
                if(groupConfig.byFolder == true){ //Group By Folder
                    match = false;
                    if(groupConfig.matchConfig.startsWith != null){
                        if(pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.startsWith) == 0)
                            match = true;
                        else
                            match = false;
                    }
                    if(groupConfig.matchConfig.endsWith != null){
                        if(pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.endsWith, pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute].length - groupConfig.matchConfig.endsWith.length) !== -1)
                            match = true;
                        else
                            match = false;
                    }
                    //If not matching then just group by attribute
                    if((groupConfig.matchConfig.endsWith == null)&&(groupConfig.matchConfig.startsWith == null)){
                        var group = groupsMap[pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute]];
                        if(group == null){
                            var label;
                            //Create Label First
                            if(groupConfig.matchConfig.label == null){
                                label = pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.labelAttribute];
                            }else{
                                label = groupConfig.matchConfig.label;
                            }
                            //Create new group and add this point
                            group = {
                                    points: new Array(),
                                    label: label
                            }
                            groupsMap[pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute]] = group;
                            
                        }
                        //Add to existing group
                        group.points.push(summary);
                    }
                        
                    //Did we have a match
                    if(match){
                        var group = groupsMap[0];
                        if(group == null){
                            //Create new group and add this point
                            var label;
                            //Create Label First
                            if(groupConfig.matchConfig.label == null){
                                label = pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.labelAttribute];
                            }else{
                                label = groupConfig.matchConfig.label;
                            }
                            
                            group = {
                                    points: new Array(),
                                    label: label,
                            }
                            groupsMap[0] = group;
                        }
                        //Add to existing group
                        group.points.push(summary);
                    }
                }else if(groupConfig.byPointSummary == true){ //Match By Point Summary
                    match = false;
                    if(groupConfig.matchConfig.startsWith != null){
                        if(summary[groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.startsWith) == 0)
                            match = true;
                        else
                            match = false;
                    }
                    if(groupConfig.matchConfig.endsWith != null){
                        if(summary[groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.endsWith, summary[groupConfig.matchConfig.matchAttribute].length - groupConfig.matchConfig.endsWith.length) !== -1)
                            match = true;
                        else
                            match = false;
                    }
                    //If not matching then just group by attribute
                    if((groupConfig.matchConfig.endsWith == null)&&(groupConfig.matchConfig.startsWith == null)){
                        var group = groupsMap[summary[groupConfig.matchConfig.matchAttribute]];
                        if(group == null){
                            var label;
                            //Create Label First
                            if(groupConfig.matchConfig.label == null){
                                label = summary[groupConfig.matchConfig.labelAttribute];
                            }else{
                                label = groupConfig.matchConfig.label;
                            }
                            //Create new group and add this point
                            group = {
                                    points: new Array(),
                                    label: label
                            }
                            groupsMap[summary[groupConfig.matchConfig.matchAttribute]] = group;
                            
                        }
                        //Add to existing group
                        group.points.push(summary);
                    }
                        
                    //Did we have a match
                    if(match){
                        var group = groupsMap[0];
                        if(group == null){
                            //Create new group and add this point
                            var label;
                            //Create Label First
                            if(groupConfig.matchConfig.label == null){
                                label = summary[groupConfig.matchConfig.labelAttribute];
                            }else{
                                label = groupConfig.matchConfig.label;
                            }
                            
                            group = {
                                    points: new Array(),
                                    label: label,
                            }
                            groupsMap[0] = group;
                        }
                        //Add to existing group
                        group.points.push(summary);
                    }
                }
            }
            //Add all the new groups
            for(l in groupsMap){
                newGroups.push(groupsMap[l]);
            }
        }
        //Add the groups to the list
        for(k in newGroups){
            pointGroups.push(newGroups[k].points);
            $('#' + divId).append( $("<option></option>").text(newGroups[k].label).val(pointGroups.length-1) );
        }
    }
}

/**
 * Load points from a group with the given index
 * @param index
 */
function loadGroupMatchAll(index){
    var group = pointGroups[index];
    loadPointsMatchAll(group);
}

/**
 * 
 * Create a drop down for all the folders
 * @param divId
 */
function createAllFoldersDropDown(divId){
        $('#' + divId).append( $("<option></option>").text("Select One").val(0) );
      //Put the sub folders into our select list on success
      loadSubfolders(root, divId);
}
/**
 * Recursive Load of folders
 * @param folder
 */
function loadSubfolders(folder, divId){
    $.each(folder.subfolders, function() {
        $('#' + divId).append(
             $("<option></option>").text(this.name).val(this.id)
        )
        loadSubfolders(this, divId);
   });
}

/**
 * Extract all points into the provided array
 * @param folder
 * @param allDataPointSummaries
 */
function loadAllPoints(folder, allDataPointSummaries){
    
    $.each(folder.points, function() {
        allDataPointSummaries.push(this);
    });
    
    //Save into lookup
    pointHierarchyMap[folder.id] = folder;
    
    $.each(folder.subfolders, function() {
        loadAllPoints(this, allDataPointSummaries);
   });
}


/**
 * Load a Folder's points into the view by matching
 * all configurations to a point
 * @param folderId
 */
function loadFolderMatchAll(folderId){
    loadPointsMatchAll(pointHierarchyMap[folderId].points);
}

/**
 * Load a Folder's points into the view by 
 * using the first configuration that matches
 * @param folderId
 */
function loadFolderMatchOne(folderId){
    
    mangoRest.hierarchy.getFolderById(folderId, function(data){

        var pointsForMasterChart = new Array();
        
        $.each(data.points, function() {
            var pointSummary = this;
            var pointConfig = matchPointSummary(pointSummary, pointConfigs);
            if(pointConfig != null){
                pointConfig.dataPointSummary = pointSummary;
                //Use the Config to build the page
                //Do we have a chart?
                if(pointConfig.chart != null){
                    createChart(pointConfig);
                }
                if(pointConfig.statistics != null){
                    createStatistics(pointConfig);
                }
                if(pointConfig.chart.includeInSummary){
                    pointsForMasterChart.push(pointConfig);
                }
                
            }else{
                $("#errors").text("Configuration not found for point with XID: " + pointSummary.xid);
            }
            
       });
       //TODO here we would filter out any points we don't want to add to the full chart
        //Now create a full chart with all points on it
        //First select the container
        //Clear all the contents
        createLineChartForAll(pointsForMasterChart, "summary");
        
    }, showError);
}

/**
 * Do the work of creating the UI by matching one point config
 * to many data points
 * @param dataPoints (data points OR data point summaries
 */
function loadPointsMatchAll(dataPoints){
    var pointsForMasterChart = new Array();
    
    $.each(pointConfigs, function() {
        var pointConfig = this;
        var pointSummary = matchPointConfig(pointConfig, dataPoints);
        if(pointSummary != null){
            //Use the Config to build the page
            //Do we have a chart?
            if(pointConfig.chart != null){
                createChart(pointConfig, pointSummary);
            }
            if(pointConfig.statistics != null){
                createStatistics(pointConfig, pointSummary);
            }
            if(pointConfig.chart.includeInSummary){
                pointsForMasterChart.push(
                        {
                            config: pointConfig,
                            dataPointSummary: pointSummary
                        });
            }
        }else{
            $("#errors").text("No points to match config: " + pointConfig);
        }
    });
    //Now create a full chart with all points on it
    createLineChartForAll(pointsForMasterChart, "summary");
}

/**
 * Match Data Point Config to a list of data point summaries
 * @param pointConfig
 * @param pointSummaries
 * @returns {@G}
 */
function matchPointConfig(config, pointSummaries){
    var summary = null;
    $.each(pointSummaries, function(){
        var pointSummary = this;
        var match = false;
        //Does this point match this template
        if(config.nameStartsWith != null){
            if(pointSummary.name.indexOf(config.nameStartsWith) == 0)
                match = true;
            else
                match = false;
        }
        if(config.nameEndsWith != null){
            if(pointSummary.name.indexOf(config.nameEndsWith, pointSummary.name.length - config.nameEndsWith.length) !== -1)
                match = true;
            else
                match = false;
        }
        if(config.xidStartsWith != null){
            if(pointSummary.xid.indexOf(config.xidStartsWith) == 0)
                match = true;
            else
                match = false;
        }

        if(config.xidEndsWith != null){
            if(pointSummary.xid.indexOf(config.xidEndsWith, pointSummary.xid.length - config.xidEndsWith.length) !== -1)
                match = true;
            else
                match = false;
        }
        //Return false when done
        if(match == true){
            summary = pointSummary;
            return false;
        }
        
       
    });
    
    return summary;
}

/**
 * Get the Point configuration by matching
 * @param pointSummary - data points summary to match
 * @param pointConfigs - list of point configs to match against
 * @returns
 */
function matchPointSummary(pointSummary, pointConfigs){
    var pointConfig = null;
    $.each(pointConfigs, function(){
        var config = this;
        var match = false;
        //Does this point match this template
        if(config.nameStartsWith != null){
            if(pointSummary.name.indexOf(config.nameStartsWith) == 0)
                match = true;
            else
                match = false;
        }
        if(config.nameEndsWith != null){
            if(pointSummary.name.indexOf(config.nameEndsWith, pointSummary.name.length - config.nameEndsWith.length) !== -1)
                match = true;
            else
                match = false;
        }
        if(config.xidStartsWith != null){
            if(pointSummary.xid.indexOf(config.xidStartsWith) == 0)
                match = true;
            else
                match = false;
        }

        if(config.xidEndsWith != null){
            if(pointSummary.xid.indexOf(config.xidEndsWith, pointSummary.xid.length - config.xidEndsWith.length) !== -1)
                match = true;
            else
                match = false;
        }
        //Return false when done
        if(match == true){
            pointConfig = config;
            return false;
        }
        
       
    });
    
    return pointConfig;
}

/**
 * Create the statistics for the point
 * 
 * @param pointConfig
 */
function createStatistics(pointConfig, dataPointSummary){
    var to = new Date();
    var from = new Date(to.getTime() - 1000*60*60); //Last hour
    mangoRest.pointValues.getStatistics(dataPointSummary.xid, formatLocalDate(from), formatLocalDate(to), function(data){
        if(data.hasData == true){
            if(pointConfig.statistics.minimumId != null)
                $("#" + pointConfig.statistics.minimumId).text(data.minimum.value + ' @ ' + data.minimum.time);
            if(pointConfig.statistics.maximumId != null)
                $("#" + pointConfig.statistics.maximumId).text(data.maximum.value + ' @ ' + data.maximum.time);
            if(pointConfig.statistics.averageId != null)
                $("#" + pointConfig.statistics.averageId).text(data.average);
            if(pointConfig.statistics.integralId != null)
                $("#" + pointConfig.statistics.integralId).text(data.integral);
            if(pointConfig.statistics.sumId != null)
                $("#" + pointConfig.statistics.sumId).text(data.sum);
            if(pointConfig.statistics.firstId != null)
                $("#" + pointConfig.statistics.firstId).text(data.first.value + ' @ ' + data.first.time);
            if(pointConfig.statistics.lastId != null)
                $("#" + pointConfig.statistics.lastId).text(data.last.value + ' @ ' + data.last.time);
            if(pointConfig.statistics.countId != null)
                $("#" + pointConfig.statistics.countId).text(data.count);
        }else{
            $("#errors").text("Statistics Error: " + data.message);
        }
        
    }, showError); 
    
}

/**
 * Format the date for use as a REST API URL parameter
 * @param now
 * @returns {String}
 */
function formatLocalDate(now) {
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear() 
        + '-' + pad(now.getMonth()+1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours())
        + ':' + pad(now.getMinutes()) 
        + ':' + pad(now.getSeconds())
        + '.' + "000"
        + dif + pad(tzo / 60) 
        + ':' + pad(tzo % 60);
}

/**
 * Create a chart for the point
 * @param dataPointSummary
 * @param pointConfig
 */
function createChart(pointConfig, dataPointSummary){
    
    if(pointConfig.chart.type == "line"){
        createLineChart(pointConfig, dataPointSummary);
    }else if(pointConfig.chart.type == "gauge"){
        createGaugeChart(pointConfig, dataPointSummary);
    }
}
    
    
/**
 * Helper to create a line chart from an XID
 * 
 */
function createLineChart(pointConfig, dataPointSummary){
    
  //Load in the Chart Configurations
    mangoRest.getJson("/modules/dashboards/web/private/charts/" + pointConfig.chart.config, function(data){
        //Modify the data to suit the point
        data.titles[0].text = pointConfig.chart.title;
        //Override and add additional Value Axis Info
        $.extend(true, data.valueAxes[0], data.valueAxes[0], pointConfig.chart.valueAxis);
        //Add the chart to it
        data.graphs[0] = 
                   {
                       id: "AmGraph-" + dataPointSummary.xid,
                       title: dataPointSummary.name,
                       valueField: dataPointSummary.xid
                   };
        //Override and add any additional features
        $.extend(true, data.graphs[0], data.graphs[0], pointConfig.chart.graph);
        var chart = new MangoAmChartHelper({
            chartDivId: pointConfig.chart.divId,
            xids: [dataPointSummary.xid],
            numberOfSamples: pointConfig.chart.pastPointCount,
            chartJson: data
        });
        chart.createChart();

        if(pointConfig.chart.realtime == true){
            realtimeChart(pointConfig, dataPointSummary, chart);
        }
        
    }, showError);
    
}

/**
 * 
 * @param pointConfig
 * @param chart
 */
function realtimeChart(pointConfig, dataPointSummary, chart){
    //Add the socket to the point config
    pointConfig.socket = mangoRest.pointValues.registerForEvents(dataPointSummary.xid,
            ['UPDATE'],
            function(message){ //On Message Received Method
               if(message.status == 'OK'){
                   
                    chart.amChart.dataProvider.shift();
                    var data = {};
                    data[dataPointSummary.xid] = message.payload.value.value;
                    data.date = message.payload.value.time;
                    chart.amChart.dataProvider.push(data);
                    chart.amChart.validateData();
                    
               }else{
                   document.getElementById('errors').innerHTML = message.payload.type + " - " + message.payload.message;
               }
            },function(error){ //On Error Method
                document.getElementById('errors').innerHTML = "Chart Update Error: " + error;
            },function(){ //On Open Method
                //document.getElementById('errors').innerHTML = '';
            },function(){ //On Close Method
                //document.getElementById('errors').innerHTML = '';
            });
    
}

    /**
     * 
     * @param pointConfig
     */
    function createGaugeChart(pointConfig, dataPointSummary){
        
        mangoRest.getJson("/modules/dashboards/web/private/charts/" + pointConfig.chart.config, function(data){
            
            //Create a gauge for it
            var gauge = new MangoAmGaugeHelper({
                xid: dataPointSummary.xid,
                gaugeDivId: pointConfig.chart.divId,
                units: pointConfig.chart.units,
                realtime: pointConfig.chart.realtime,
                jsonConfig: data,
                realtimeError: function(error){document.getElementById('errors').innerHTML = "Gauge Update Error: " + error;}
            });
            gauge.startGauge();
        }, showError);

    }
    
    /**
     * TODO Make this use the chart configs for each point
     * they will need to be passed in
     * @param dataPointSummaries
     * @param dashboard
     */
    function createLineChartForAll(dataPointMap){
    
        //Load in the Chart Configurations
        mangoRest.getJson("/modules/dashboards/web/private/charts/simpleLine.json", function(data){
            //Modify the data to suit the point
            data.titles[0].text = "All Points";
            var xids = new Array();
            for(var i=0; i<dataPointMap.length; i++){
                var entry = dataPointMap[i];
                xids.push(entry.dataPointSummary.xid);
                //Add the chart to it
                var graph = {
                               id: "AmGraph-" + i,
                               title: entry.dataPointSummary.name,
                               valueField: entry.dataPointSummary.xid
                           };
                //Override and add any additional features
                $.extend(true, graph, entry.config.chart.graph, graph);
                data.graphs.push(graph);
                
            }
            var chart = new MangoAmChartHelper({
                chartDivId: "summary",
                xids: xids,
                numberOfSamples: 200,
                chartJson: data
            });
            chart.createChart();
            
            
        }, showError);
        
    }
    
    function showError(jqXHR, textStatus, errorThrown, mangoMessage){
    
        var msg = "";
        if(textStatus != null)
            msg += (textStatus + " ");
        if(errorThrown != null)
            msg += (errorThrown + " ");
        if(mangoMessage != null)
            msg += (mangoMessage + " ");
        msg += "\n";
        $("#errors").text(msg);
    }

