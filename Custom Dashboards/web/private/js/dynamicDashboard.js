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
        loadSubfolders(root);
    });
    
    //Load in the Chart Configurations
    mangoRest.getJson("/modules/dashboards/web/private/charts/simpleGauge.json", function(data){
        gaugeConfig = data;
    }, showError);
    
    
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

/**
 * Load a Folder's points into the view
 * @param folderId
 */
function loadFolder(folderId){
    
    mangoRest.hierarchy.getFolderById(folderId, function(data){
        //First select the container
        var dashboard = $("#dashboard");
        //Clear all the contents
        dashboard.empty();
        
        $.each(data.points, function() {
            
            
            //TODO Here we would select a chart type for the values
            //Create a chart for it
            createLineChart(this, dashboard);
            
//            //Create a gauge for it
//            var gauge = new MangoAmGaugeHelper({
//                xid: this.xid,
//                gaugeDivId: this.xid,
//                units: "",
//                jsonConfig: gaugeConfig,
//            });
//            gauge.startGauge();
            
       });
       //TODO here we would filter out any points we don't want to add to the full chart
        //Now create a full chart with all points on it
        createLineChartForAll(data.points, dashboard);
        
    }, showError);
}
    /**
     * Helper to create a line chart from an XID
     * 
     */
    function createLineChart(dataPointSummary, dashboard){
      //Create a new div
        dashboard.append("<div id='" 
                + dataPointSummary.xid 
                + "' style='width:100%; height:400px; vertical-align: top;  display: inline-block; padding: 10px;'"
                + "></div>");
      //Load in the Chart Configurations
        mangoRest.getJson("/modules/dashboards/web/private/charts/simpleLine.json", function(data){
            //Modify the data to suit the point
            data.titles[0].text = dataPointSummary.name;
            //Add the chart to it
            data.graphs[0] = 
                       {
                           bullet: "round",
                           id: "AmGraph-1",
                           title: dataPointSummary.name,
                           valueField: dataPointSummary.xid
                       };
            var chart = new MangoAmChartHelper({
                chartDivId: dataPointSummary.xid,
                xids: [dataPointSummary.xid],
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

function createLineChartForAll(dataPointSummaries, dashboard){
  //Create a new div
    dashboard.append("<div id='allPointsChart" 
            + "' style='width:100%; height:400px; vertical-align: top;  display: inline-block; padding: 10px;'"
            + "></div>");
    //Load in the Chart Configurations
    mangoRest.getJson("/modules/dashboards/web/private/charts/simpleLine.json", function(data){
        //Modify the data to suit the point
        data.titles[0].text = "All Points";
        var xids = new Array();
        for(var i=0; i<dataPointSummaries.length; i++){
            var dataPointSummary = dataPointSummaries[i];
            xids.push(dataPointSummary.xid);
            //Add the chart to it
            data.graphs.push( 
                       {
                           bullet: "round",
                           id: "AmGraph-" + i,
                           title: dataPointSummary.name,
                           valueField: dataPointSummary.xid
                       });
            
            
        }
        var chart = new MangoAmChartHelper({
            chartDivId: "allPointsChart",
            xids: xids,
            numberOfSamples: 50,
            chartJson: data
        });
        chart.createChart();
        
        
    }, showError);
    
}
