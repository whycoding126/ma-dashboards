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
        //Modify the configuration for your page here
        data.nameEndsWith = "in F";
        data.chart.divId = "temperatureChart";
        data.chart.title = "Temperature";
        data.chart.bullet = "square";
        data.chart.color = "green";
        pointConfigs.push(data);
        
        //Duplicate for all points you want
        var voltsPointConfig = {};
        $.extend(true, voltsPointConfig,data);
        voltsPointConfig.nameEndsWith = "volts";
        voltsPointConfig.chart.divId = "voltageChart";
        voltsPointConfig.chart.title = "Voltage";
        voltsPointConfig.chart.bullet = "round";
        voltsPointConfig.chart.color = "blue";
        pointConfigs.push(voltsPointConfig);
        
    }, showError);
    
//    mangoRest.getJson("/modules/dashboards/web/private/points/simpleMultistate.json", function(data){
//      //Modify the configuration for your page here
//        
//        pointConfigs.push(data);
//    }, showError);    
    
});

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
            //Add the chart to it
            data.graphs[0] = 
                       {
                           id: "AmGraph-" + pointConfig.dataPointSummary.xid,
                           bullet: pointConfig.chart.bullet,
                           lineColor: pointConfig.chart.color,
                           title: pointConfig.dataPointSummary.name,
                           valueField: pointConfig.dataPointSummary.xid
                       };
            var chart = new MangoAmChartHelper({
                chartDivId: pointConfig.chart.divId,
                xids: [pointConfig.dataPointSummary.xid],
                numberOfSamples: 50,
                chartJson: data
            });
            chart.createChart();

           //TODO Code for real time updating a chart
//            chart.dataProvider.shift();
//            chart.dataProvider.push({
//                date: newDate,
//                visits: visits
//            });
//            chart.validateData();
            
        }, showError);
        
    }

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
                data.graphs.push( 
                           {
                               bullet: config.chart.bullet,
                               id: "AmGraph-" + i,
                               title: config.dataPointSummary.name,
                               lineColor: config.chart.color,
                               valueField: config.dataPointSummary.xid
                           });
                
                
            }
            var chart = new MangoAmChartHelper({
                chartDivId: "summary",
                xids: xids,
                numberOfSamples: 50,
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

