    /*
    * PLEASE DOC ALL THINGS so that we canb use this as a example later
    * class College JavaScript // fixme naming and what.  
    *setting up the global var for the templater so that we can use in things like listviews and other widgets that are from custom classes
    */
    var templater;
   
   
    /*
    * Fires when the everything is ready to show
    */
   $( document ).ready(function(){

    /**
    *Here is the Array that is used to push charts and other widgets to the DisplayManger
    */
       var displayConfigurations = new Array();
       
       
       var kwhChart = new  SerialChartConfiguration(
               'kwhChartDiv', //Chart DIV id
               /*
               * List of data provider Ids for this chart
               */
               [1],
               { //AmChart Mixins
           titles: [{
               id: "Title-1",
               size: 15,
               text: "KWH"

           }],
           categoryField: "timestamp",
           color: "whitesmoke",
					"startEffect": "bounce",

           graphs: [{
               title: "Kilo watts per hour",
               valueAxis: "kwh-axis",
               
               //Function to render the text inside the balloons
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               
               bullet: "square",
               bulletSize: 6,
               lineColor: "green",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "value"
           }],
           valueAxes: [{
               id: "kwh-axis",
               title: " KWH ",
               position: "left"
           }],
       });
       displayConfigurations.push(kwhChart);




        /**
        *AMPS Line Chart
        */
       var ampsChart = new  SerialChartConfiguration(
               /**
               * The Chart Id that is given to pass on to html
               */
               'ampsChartDiv', //Chart DIV id
               /*
               * List of data provider Ids for this chart
               */
               [2,3,4],
               /**
               * Start AmChart Styling
               */
               {
           titles: [{
               id: "Title-1",
               size: 15,
               text: "Amps "
           }],
           categoryField: "timestamp",
           color: "whitesmoke",
           "startEffect": "bounce",
           graphs: [{
               title: "Amps Phase A",
               valueAxis: "phaseA-axis",
               /*
               *Function to render the text inside the balloons
               */
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               bullet: "square",
               bulletSize: 6,
               lineColor: "green",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "phaseA"
           },{              
               title: "Amps Phase B",
               valueAxis: "phaseB-axis",
               /**
               *Function to render the text inside the balloons
               */
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               bullet: "round",
               bulletSize: 6,
               lineColor: "red",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "phaseB"
           },{              
               title: "Amps Phase C",
               valueAxis: "phaseC-axis",
               /**
               *Function to render the text inside the balloons
               */
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               bullet: "round",
               bulletSize: 6,
               lineColor: "yellow",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "phaseC"
           }],
           valueAxes: [{
               id: "phaseA-axis",
               title: " Phase A (Amps) ",
               position: "left",
               color: "green"
           },{
               id: "phaseB-axis",
               title: " Phase B (Amps) ",
               position: "right",
               color: "red"
           },{
               id: "phaseC-axis",
               title: " Phase C (Amps) ",
               position: "right",
               color: "yellow"
           }
           ],
           /*
           * End style of AmCharts
           */
       },{
       },{
           /*
           *Multi-series chart so create mappings from point to a graph valueField
           */
           dataPointMappings: [{
                   nameEndsWith: 'Phase A (A)',
                   valueField: 'phaseA' 
               },{
                   nameEndsWith: 'Phase B (A)',
                   valueField: 'phaseB'
               },{
                   nameEndsWith: 'Phase C (A)',
                   valueField: 'phaseC'
               }]
       });
       displayConfigurations.push(ampsChart);
       
       /**
       * Amps Bar Chart  w/Point Value Data Providers
       */
       var ampsBarChart = new BarChartConfiguration(
               'ampsBarChartDiv',
               /*
               * List of data provider Ids for this chart
               */
               [2,3,4],
                /**
                * Start AmChart Styling
                */
               {
                    "categoryField": "name",
                    "rotate": true,
                    "color": "whitesmoke",
					"startEffect": "bounce",
                   "graphs": [
                              {
                                  "balloonText": "Average:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Total",
                                  "type": "column",
                                  "valueField": "value",
                                  "lineColor": "#CF000F"
                              }
                          ],
                          "guides": [],
                          "valueAxes": [
                              {
                                  "id": "ValueAxis-1",
                                  "position": "top",
                                  "axisAlpha": 0
                              }
                          ],
       },{//Empty Mango Chart Mixins
           categoryField: "name", //What member of the data point to use as category label/separator
       },{
       });
       displayConfigurations.push(ampsBarChart);
       
       /*
       * Voltage Bar Chart for use with Statistics Data Providers
       */
       var voltageChart = new  SerialChartConfiguration(
               'voltageChartDiv', //Chart DIV id
               /*
               * List of data provider Ids for this chart
               */
               [9,10,11],
               /**
               * Start AmChart Styling
               */
               {
                   "categoryField": "xid",
                   "color": "whitesmoke",
                   "startEffect": "bounce",
                   "graphs": [
                              {
                                  "balloonText": "Minimum:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Minimum",
                                  "type": "column",
                                  "valueField": "minimum"
                              },
                              {
                                  "balloonText": "Maximum:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-2",
                                  "lineAlpha": 0.2,
                                  "title": "Maximum",
                                  "type": "column",
                                  "valueField": "maximum"
                              },
                              {
                                  "balloonText": "Average:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-3",
                                  "lineAlpha": 0.2,
                                  "title": "Average",
                                  "type": "column",
                                  "valueField": "average"
                              }
                          ],
                          "guides": [],
                          "titles": [
						{
							"id": "Title-1",
							"size": 15,
							"text": "Voltage"
						}
					],
                          "valueAxes": [
                              {
                                  "id": "ValueAxis-1",
                                  "position": "top",
                                  "axisAlpha": 0,
                                  "title": ""
                              }
                          ],
       },{//Empty Mango Chart Mixins
           categoryField: "xid", //What member of the data point to use as category label/separator
       },{
       });
       displayConfigurations.push(voltageChart);
       
       
           var kwhBarChart = new StatisticsBarChartConfiguration(
               'kwhBarChartDiv',
               /*
               * List of data provider Ids for this chart
               */
               [12,13,14],
               /**
               * Start AmChart Styling
               */
               {
                "categoryField": "name",
                "rotate": false,
                "color": "whitesmoke",
                  "graphs": [
                              {
                                  "balloonText": "Minimum:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Minimum",
                                  "type": "column",
                                  "valueField": "minimum"
                              },
                              {
                                  "balloonText": "Maximum:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Maximum",
                                  "type": "column",
                                  "valueField": "maximum"
                              },
                              {
                                  "balloonText": "Average:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-2",
                                  "lineAlpha": 0.2,
                                  "title": "Average",
                                  "type": "column",
                                  "valueField": "average"
                              },
                               {
                                  "balloonText": "Integral:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-3",
                                  "lineAlpha": 0.2,
                                  "title": "Integral",
                                  "type": "column",
                                  "valueField": "average"
                              },
                            {
                                  "balloonText": "Sum:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-3",
                                  "lineAlpha": 0.2,
                                  "title": "Sum",
                                  "type": "column",
                                  "valueField": "average"
                              },
                          ],
                          
                          "guides": [],
                              "titles": [
						{
							"id": "Title-1",
							"size": 15,
							"text": "Statistics"
						}
					],
                          
                          
                          "valueAxes": [
                              {
                                  "id": "ValueAxis-1",
                                  "position": "top",
                                  "axisAlpha": 0,

                              }
                          ],
       },{//Empty Mango Chart Mixins
           categoryField: "name", //What member of the data point to use as category label/separator
       },{
       });
       displayConfigurations.push(kwhBarChart);




 var voltsBarChart = new BarChartConfiguration(
               'voltsBarChartDiv',
               /*
               * List of data provider Ids for this chart
               */
               [15,16,17], 
               /**
               * Start AmChart Styling
               */
               { //AmChart Mixins
                   "categoryField": "name",
                   "rotate": true,
                   "color": "whitesmoke",
                   "graphs": [
                              {
                                  "balloonText": "Average:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Total",
                                  "type": "column",
                                  "valueField": "value",
                                  "lineColor": "#4183D7"
                              }
                          ],
                          "guides": [],
                          "valueAxes": [
                              {
                                  "id": "ValueAxis-1",
                                  "position": "top",
                                  "axisAlpha": 0
                              }
                          ],
       },{//Empty Mango Chart Mixins
           categoryField: "name", //What member of the data point to use as category label/separator
       },{
       });
       displayConfigurations.push(voltsBarChart);


var kwBarChart = new BarChartConfiguration(
               'kwBarChartDiv',
               /*
               * List of data provider Ids for this chart
               */
               [18,19,20],
               /**
               * Start AmChart Styling
               */
               {
                   "categoryField": "name",
                   "rotate": true,
                   "color":"whitesmoke",
                   "graphs": [
                              {
                                  "balloonText": "Average:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Total",
                                  "type": "column",
                                  "valueField": "value"
                              }
                          ],
                          "guides": [],
                          "valueAxes": [
                              {
                                  "id": "ValueAxis-1",
                                  "position": "top",
                                  "axisAlpha": 0
                              }
                          ],
       },{//End AmChart Styles
       
           categoryField: "name", //What member of the data point to use as category label/separator
       },{
       });
       displayConfigurations.push(kwBarChart);


var powerFactorBarChart = new BarChartConfiguration(

               'powerFactorBarChartDiv',
                /*
                * List of data provider Ids for this chart
                */
               [21,22,23],
               /**
               * Start AmChart Styling
               */
               {
                   "categoryField": "name",
                   "rotate": true,
                   "color": "whitesmoke",
                   "graphs": [
                              {
                                  "balloonText": "Average:[[value]]",
                                  "fillAlphas": 0.8,
                                  "id": "AmGraph-1",
                                  "lineAlpha": 0.2,
                                  "title": "Total",
                                  "type": "column",
                                  "valueField": "value",
                                  "lineColor": "#A62B2B",
                              }
                          ],
                          "guides": [],
                          "valueAxes": [
                              {
                                  "id": "ValueAxis-1",
                                  "position": "top",
                                  "axisAlpha": 0
                              }
                          ],
       },{//end amcharts styles
       /**
       * this is the member of the data point to use as category label/separator
       * could be name xid or ?
       */
           categoryField: "name", 
       },{
       });
       displayConfigurations.push(powerFactorBarChart);

        /**
        * This is the Volts line chart that also shows statistics al
        */
       var voltsLineChart = new  SerialChartConfiguration(
               'voltsLineChartDiv', //Chart DIV id
               /*
               * List of data provider Ids for this chart
               */
               [24,25,26], 
            /**
            *AmChart Styles fo a chart.
            */
               {
           titles: [{
               id: "Title-1",
               size: 15,
               text: "Volts "
           }],
           categoryField: "timestamp",
           color: "whitesmoke",
           graphs: [{
               title: "Volts A-N",
               valueAxis: "voltsA-axis",
               /*
               *Function to render the text inside the balloons
               */
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               bullet: "square",
               bulletSize: 6,
               lineColor: "green",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "voltsA"
           },{              
               title: "Volts B-N",
               valueAxis: "voltsB-axis",
               /*
               *Function to render the text inside the balloons
               */
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               bullet: "round",
               bulletSize: 6,
               lineColor: "red",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "voltsB"
           },{              
               title: "Volts C-N",
               valueAxis: "voltsC-axis",
               /**
               * Function to render the text inside the balloons
               */
               //TODO Make this bulletproof and create a way to get a default 'graph'
               balloonFunction: function(graphDataItem, amGraph){
                   if(typeof graphDataItem.values != 'undefined'){
                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
                   }else{
                       return "";
                   }
               },
               bullet: "round",
               bulletSize: 6,
               lineColor: "yellow",
               lineThickness: 1,
               negativeLineColor: "red",
               type: "smoothedLine",
               valueField: "voltsC"
           }],
           valueAxes: [{
               id: "voltsA-axis",
               title: " Volts A-N ",
               position: "left",
               color: "green"
           },{
               id: "voltsB-axis",
               title: " Volts B-N ",
               position: "right",
               color: "red"
           },{
               id: "voltsC-axis",
               title: " Volts C-N ",
               position: "right",
               color: "yellow"
           }
           ],
       },{
       },{
           /*
           * Setting Multi-series chart to create mappings from point to a graph valueField
           */
           dataPointMappings: [{
                   nameEndsWith: 'Voltage A-N (V)',
                   valueField: 'voltsA' 
               },{
                   nameEndsWith: 'Voltage B-N (V)',
                   valueField: 'voltsB'
               },{
                   nameEndsWith: 'Voltage C-N (V)',
                   valueField: 'phaseC'
               }]
       });
       displayConfigurations.push(voltsLineChart);
       

// END THE CHARTS


       /**
       * Seting up the statistics Display for a different page on mobile.  This is different then on desktop due to the page stacking of are toolkits
       */
       displayConfigurations.push(
       
       new StatisticsConfiguration(
                'accumulator', 
                [5]
                )
       );
       
       displayConfigurations.push(
                new StatisticsConfiguration(
                'currentPhaseA',
                [6]
            )
        );  
       
       displayConfigurations.push(
                new StatisticsConfiguration(
                'currentPhaseB',
                [7]
            )
        );    
       
       displayConfigurations.push(
                new StatisticsConfiguration(
                'currentPhaseC',
                [8]
            )
        );    

       //Create Custom Data Provider To Compute kWh
       var dataProviders = new Array();
       var kwhDataProvider = new PointValueDataProvider(1, {manipulateData: function(pointValues, dataPoint){
           var newData = new Array();
           if(pointValues.length == 0)
               return newData;

           var previous = pointValues[0]
           //Subtract previous value from current.
           for(var i=1; i<pointValues.length; i++){
               var current = pointValues[i];
               var entry = {
                       value: current.value - previous.value,
                       timestamp: current.timestamp
               };
               newData.push(entry);
               
               //Move along
               previous = current;
           }
           
           return newData;
       }});
       dataProviders.push(kwhDataProvider);
       
       //Setup Point Configurations
       var pointConfigurations = new Array();

       
       
      
      /**
      *Kilo Watts per hour 
      */
       pointConfigurations.push(
                new DataPointMatchConfiguration(
                1, 
                [{ matchAttribute: 'name', regex: /.*\(kWh\)/}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                2,
                [{matchAttribute: 'name', regex: /Phase A\ \(A\)/g}]
            )
        );
       
       
       pointConfigurations.push(
                new DataPointMatchConfiguration(
                3,
                [{matchAttribute: 'name', regex: /Phase\ B\ \(A\)/g}]
            )
       );
       


       pointConfigurations.push(
                new DataPointMatchConfiguration(
                4,
                [{matchAttribute: 'name', regex: /Phase\ C\(\A\)/g}]
                )
       );  
       
    
       pointConfigurations.push(
                new DataPointMatchConfiguration(
                5, 
                [{matchAttribute: 'name', regex: /.*\(kWh\)/, providerType: 'Statistics'}]
            )
        );



       pointConfigurations.push(
            new DataPointMatchConfiguration(
            6,
            [{matchAttribute: 'name',regex: /Phase\ \A\ \(A\)/g, providerType: 'Statistics'}]
                )
            )

       pointConfigurations.push(
            new DataPointMatchConfiguration(
            7,
            [{matchAttribute: 'name' , regex: /Phase\ \B\ \(\A\)/g , providerType: 'Statistics'}]
                )
            )

       pointConfigurations.push(
            new DataPointMatchConfiguration(
            8,
            [{matchAttribute: 'name' , regex: /\Phase\ C\ \(A\)/g, providerType: 'Statistics'}]
            )
        )

       pointConfigurations.push(
            new DataPointMatchConfiguration(
            9,
            [{matchAttribute:'name', regex: /Voltage\ \A-N\ \(V\)/g , providerType: 'Statistics'}]
            )
        )

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                10,
                [{matchAttribute: 'name' ,regex: /Voltage\ B-N\ \(V\)/g, providerType: 'Statistics'}]
            )
        )

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                11, 
                [{matchAttribute: 'name', regex: /Voltage\ C-N\ \(V\)/g , providerType: 'Statistics'}]
            )
       )

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                12,
                [{matchAttribute: 'name' , regex: /kWh/g }],
                {providerType: 'Statistics'}
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                13, 
                [{matchAttribute: 'name',regex: /\(kWh\)/g , providerType: 'Statistics'}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                14, 
                [{matchAttribute: 'name' ,regex: /\(kWh\)/g,providerType: 'Statistics'}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                15,
                [{matchAttribute: 'name' , regex: /Voltage\ A-N\ \(V\)/g }]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                16, 
                [{matchAttribute: 'name', regex: /Voltage\ B-N\ \(V\)/g}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                17, 
                [{matchAttribute: 'name' , regex: /Voltage\ \C-N\ \(V\)/g}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                18, 
                [{matchAttribute: 'name' , regex: /Real\ Power\ A\ \(kW\)/g }]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                19,
                [{matchAttribute: 'name' ,regex: /Real\ Power\ B\ \(kW\)/g}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                20,
                [{matchAttribute:'name' , regex: /Real\ Power\ C\ \(kW\)/g}]
            )
        );

       
       pointConfigurations.push(
                new DataPointMatchConfiguration(
                21,
                [{matchAttribute: 'name', regex: /Power\ Factor\ A/g}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                22,
                [{matchAttribute: 'name' , regex: /Power\ Factor\ B/g}]
            )
       );

       pointConfigurations.push(
                new DataPointMatchConfiguration(
                23, 
                [{matchAttribute: 'name' , regex: /Power\ Factor\ C/g }]
            )
       );

       pointConfigurations.push
                (new DataPointMatchConfiguration(
                24,
                [{matchAttribute: 'name' , regex: /Voltage\ A-N\ \(V\)/g }]
            )
       );
       
       pointConfigurations.push(
                new DataPointMatchConfiguration(
                25, 
                [{matchAttribute: 'name' , regex: /Voltage\ B-N\ \(V\)/g }]
            )
       );
       
       pointConfigurations.push(
                new DataPointMatchConfiguration(
                26,
                [{matchAttribute: 'name' , regex: /Voltage\ C-N\ \(V\)/g}]
            )
       );
       
       //Setup Groups
       
       var meterGroups = new DataPointGroupConfiguration({
           groupBy: 'Folder',
           labelAttribute: 'name',
           matchConfigurations: [{ matchAttribute: 'path' , regex: /.\/Buildings\/City\ Plex\/Meters\/M.*\ / }]
           }
           );
       
       
       /**
       * Setting up the Grouper Araary
       */
       var groupConfigurations = new Array();
       
       /**
       * Adding the Meters Group to the COnfig so that it can be passed off to the templater
       */
       groupConfigurations.push(meterGroups);
       
       /**
       *Create a custom grouper for jquery mobiles listview element
       */
       var groupListView = new ListViewConfiguration(
        'groupsList', 
        {},
        /*
        * Adding Custom Class tags to the object of the JQuery Mobiles ListView
        */
        {styleClass: "ui-btn ui-btn-icon-right  ui-icon-gear"}
        );
       
       /**
       *Setting upo the main Templater and adding all the vars ans what not to the Display
       */
       var templaterConfig = {
               debug: true,
               type: 'PointHierarchy',
               displayConfigurations: displayConfigurations,
               pointConfigurations: pointConfigurations,
               groupConfigurations: groupConfigurations,
               dataProviders: dataProviders,
               groupSelectConfiguration: groupListView,
       }
       
       templater = new DashboardTemplater(templaterConfig);
            
   });// End When page Ready
   
        /**
        * Display Errors method
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
            $("#errors").text(msg);
        }

