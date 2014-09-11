/**
 * Javascript code for the dynamicDashboard.shtm page
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

//Global Chart Configurations
var gaugeConfig;
var lineConfig;
var pointConfigs = new Array();

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
                    type: "smoothedLine",
                }
            }
        }
  ];


/*
 * At page load setup the divs
 */
$( document ).ready(function(){

    //Load the point hierarchy
    mangoRest.hierarchy.getRoot(function(root){
        $('#allFolders').append(
                $("<option></option>").text("Select One").val(0)
           )
      //Put the sub folders into our select list on success
           loadSubfolders(root);
    });
    
    //Load in the Chart Configurations
    mangoRest.getJson("/modules/dashboards/web/private/charts/simpleGauge.json", function(data){
        gaugeConfig = data;
    }, showError);
    
    //Load in the Point Configurations for Numeric Points
    mangoRest.getJson("/modules/dashboards/web/private/points/simpleNumeric.json", function(data){
        for(i in numericPointOverrides)
            pointConfigs.push(createNewPointConfig(numericPointOverrides[i], data));
        
    }, showError);
    
//    mangoRest.getJson("/modules/dashboards/web/private/points/simpleMultistate.json", function(data){
//      //Modify the configuration for your page here
//        
//        pointConfigs.push(data);
//    }, showError);    
    
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
 * Recursive Load of folders
 * @param folder
 */
function loadSubfolders(folder){
    $.each(folder.subfolders, function() {
        $('#allFolders').append(
             $("<option></option>").text(this.name).val(this.id)
        )
        loadSubfolders(this);
   });
}

/**
 * Load a Folder's points into the view
 * @param folderId
 */
function loadFolder(folderId){
    
    mangoRest.hierarchy.getFolderById(folderId, function(data){

        var pointsForMasterChart = new Array();
        
        $.each(data.points, function() {
            var pointSummary = this;
            var pointConfig = getPointConfig(pointSummary);
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
 * Get the Point configuration by matching
 * @param pointSummary
 * @returns
 */
function getPointConfig(pointSummary){
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
function createStatistics(pointConfig){
    var to = new Date();
    var from = new Date(to.getTime() - 1000*60*60); //Last hour
    mangoRest.pointValues.getStatistics(pointConfig.dataPointSummary.xid, formatLocalDate(from), formatLocalDate(to), function(data){

        $("#" + pointConfig.statistics.minimumId).text(data.minimum.value + ' @ ' + data.minimum.time);
        $("#" + pointConfig.statistics.maximumId).text(data.maximum.value + ' @ ' + data.maximum.time);
        $("#" + pointConfig.statistics.averageId).text(data.average);
        $("#" + pointConfig.statistics.integralId).text(data.integral);
        $("#" + pointConfig.statistics.sumId).text(data.sum);
        $("#" + pointConfig.statistics.firstId).text(data.first.value + ' @ ' + data.first.time);
        $("#" + pointConfig.statistics.lastId).text(data.last.value + ' @ ' + data.last.time);
        $("#" + pointConfig.statistics.countId).text(data.count);
        
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
function createChart(pointConfig){
    
    if(pointConfig.chart.type == "LINE"){
        createLineChart(pointConfig);
    }else if(pointConfig.chart.type == "GAUGE"){
        createGaugeChart(pointConfig);
    }
}
    
    
/**
 * Helper to create a line chart from an XID
 * 
 */
function createLineChart(pointConfig){
    
  //Load in the Chart Configurations
    mangoRest.getJson("/modules/dashboards/web/private/charts/" + pointConfig.chart.config, function(data){
        //Modify the data to suit the point
        data.titles[0].text = pointConfig.chart.title;
        //Override and add additional Value Axis Info
        $.extend(true, data.valueAxes[0], pointConfig.chart.valueAxis, data.valueAxes[0]);
        //Add the chart to it
        data.graphs[0] = 
                   {
                       id: "AmGraph-" + pointConfig.dataPointSummary.xid,
                       title: pointConfig.dataPointSummary.name,
                       valueField: pointConfig.dataPointSummary.xid
                   };
        //Override and add any additional features
        $.extend(true, data.graphs[0], pointConfig.chart.graph, data.graphs[0]);
        var chart = new MangoAmChartHelper({
            chartDivId: pointConfig.chart.divId,
            xids: [pointConfig.dataPointSummary.xid],
            numberOfSamples: pointConfig.chart.pastPointCount,
            chartJson: data
        });
        chart.createChart();

        if(pointConfig.chart.realtime == true){
            realtimeChart(pointConfig, chart);
        }
        
    }, showError);
    
}

/**
 * 
 * @param pointConfig
 * @param chart
 */
function realtimeChart(pointConfig, chart){
    //Add the socket to the point config
    pointConfig.socket = mangoRest.pointValues.registerForEvents(pointConfig.dataPointSummary.xid,
            ['UPDATE'],
            function(message){ //On Message Received Method
               document.getElementById('errors').innerHTML = "";
               if(message.status == 'OK'){
                   
                    chart.amChart.dataProvider.shift();
                    var data = {};
                    data[pointConfig.dataPointSummary.xid] = message.payload.value.value;
                    data.date = message.payload.value.time;
                    chart.amChart.dataProvider.push(data);
                    chart.amChart.validateData();
                    
               }else{
                   document.getElementById('errors').innerHTML = message.payload.type + " - " + message.payload.message;
               }
            },function(error){ //On Error Method
                document.getElementById('errors').innerHTML = error;
            },function(){ //On Open Method
                document.getElementById('errors').innerHTML = '';
            },function(){ //On Close Method
                document.getElementById('errors').innerHTML = '';
            });
    
}

    /**
     * 
     * @param pointConfig
     */
    function createGaugeChart(pointConfig){
      //Create a gauge for it
      var gauge = new MangoAmGaugeHelper({
          xid: pointConfig.dataPointSummary.xid,
          gaugeDivId: pointConfig.chart.divId,
          units: "",
          jsonConfig: gaugeConfig,
      });
      gauge.startGauge();
    }
    
    /**
     * TODO Make this use the chart configs for each point
     * they will need to be passed in
     * @param dataPointSummaries
     * @param dashboard
     */
    function createLineChartForAll(dataPointConfigs){
    
        //Load in the Chart Configurations
        mangoRest.getJson("/modules/dashboards/web/private/charts/simpleLine.json", function(data){
            //Modify the data to suit the point
            data.titles[0].text = "All Points";
            var xids = new Array();
            for(var i=0; i<dataPointConfigs.length; i++){
                var config = dataPointConfigs[i];
                xids.push(config.dataPointSummary.xid);
                //Add the chart to it
                var graph = {
                               id: "AmGraph-" + i,
                               title: config.dataPointSummary.name,
                               valueField: config.dataPointSummary.xid
                           };
                //Override and add any additional features
                $.extend(true, graph, config.chart.graph, graph);
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

