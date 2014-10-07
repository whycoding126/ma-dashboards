

//Default to value from last midnight
var kWhDailyBarChartTo = new Date(); //Till now
var kWhDailyBarChartFrom = new Date();
kWhDailyBarChartFrom.setHours(0,0,0,0);

   var kWhDailyBarChartDataProviderSettings = {
           //Setup the Date/Rollups
       from: kWhDailyBarChartFrom,
       to: kWhDailyBarChartTo,
       rollup: 'AVERAGE',
       timePeriodType: 'HOURS',
       timePeriods: 1, //Always 1
   };



//Setup a Display Manager for the Bar Chart
       var kwhDisplayConfigurations = new Array();
       //Setup The Bar Chart
       //Create a bar chart for use with Point Value Data Providers
       var kwhBarChart = new BarChartConfiguration(
               'kWhDailyBarChartDiv',
               [1], //List of data provider Ids for this chart
               { //AmChart Mixins
                   rotate: false,
                   categoryField: "time",
                   categoryAxis: {
                       "gridPosition": "start",
                       "labelRotation": 45
                   },
                   graphs: [
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
       },{//Empty Mango Chart Mixins
           /**
            * Default behaviour is to average them values
            * Data Provider Listener
            * On Data Provider load we add new data
            */
           onLoad: function(data, dataPoint){

               //Create one entry for every piece of data
               for(var i=0; i<data.length; i++){
                   
                   //Format the Time Depending on the Rollup
                   var time;
                   if(kWhDailyBarChartDataProviderSettings.timePeriodType == 'HOURS')
                       time = new Date(data[i].timestamp).toLocaleTimeString();
                   if(kWhDailyBarChartDataProviderSettings.timePeriodType == 'DAYS')
                       time = new Date(data[i].timestamp).toLocaleDateString();
                   if(kWhDailyBarChartDataProviderSettings.timePeriodType == 'MONTHS')
                       time = new Date(data[i].timestamp).toLocaleDateString();

                   
                   var entry = {
                           time: time,
                           value: data[i].value
                   };
                   this.amChart.dataProvider.push(entry);
               }
               this.amChart.validateData();
           }
       },{
       });
       kwhDisplayConfigurations.push(kwhBarChart);
       var kWhDailyBarChartDisplayManager = new DataDisplayManager(kwhDisplayConfigurations);
       var kWhDailyBarDataProvider = new PointValueDataProvider(1, {manipulateData: function(pointValues, dataPoint){
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
       kWhDailyBarChartDisplayManager.addProvider(kWhDailyBarDataProvider); //Ensure we add our data provider
       
       
       /*
        * Fires when the everything is ready to show
        */
       $( document ).ready(function(){
           
           var kWhPerDayFromDate = new DateTimePickerConfiguration('kWhFromDate', 
                   {}, 
                   {
                       defaultValue: kWhDailyBarChartDataProviderSettings.from,
                       owner: null,
                       onChange: function(date){
                           console.log("kWh From Date: " +  date);
                           kWhDailyBarChartDataProviderSettings.from = date;
                           kWhDailyBarChartDisplayManager.clear(false);
                           kWhDailyBarChartDisplayManager.refresh(null, kWhDailyBarChartDataProviderSettings);
                       }
                   }
           );
           kWhPerDayFromDate.create();
           
           var kWhPerDayToDate = new DateTimePickerConfiguration('kWhToDate', 
                   {}, 
                   {
                       defaultValue: kWhDailyBarChartDataProviderSettings.to,
                       owner: null,
                       onChange: function(date){
                           console.log("kWh To Date: " +  date);
                           kWhDailyBarChartDataProviderSettings.to = date;
                           kWhDailyBarChartDisplayManager.clear(false);
                           kWhDailyBarChartDisplayManager.refresh(null, kWhDailyBarChartDataProviderSettings);
                       }
                   }
           ); 
           kWhPerDayToDate.create();

       
           //Setup The kWh Chart Area (Not using the Templater)
           var customPeriodSelect = new SelectConfiguration('simpleTimePicker', 
                   {options: [
                              {label: 'Today', value: "0"},
                              {label: '7 Days', value: "1"},
                              {label: '30 Days', value: "2"},
                              {label: 'This Year', value: "3"}
                              ]
                   },
                   {
                       onChange: function(value,owner){
                           console.log("customPeriod: " + value);
                           if(value == "0"){
                               kWhDailyBarChartDataProviderSettings.from = new Date();
                               kWhDailyBarChartDataProviderSettings.from.setHours(0,0,0,0);
                               kWhDailyBarChartDataProviderSettings.to = new Date();
                               $("#simpleTimePeriodType").val("HOURS");
                               if($("#simpleTimePeriodType").selectmenu != undefined)
                                   $("#simpleTimePeriodType").selectmenu('refresh', true);
                               kWhDailyBarChartDataProviderSettings.timePeriodType = "HOURS";        

                           }else if(value == "1"){
                               kWhDailyBarChartDataProviderSettings.to = new Date();
                               //Subtract 7*24Hrs
                               kWhDailyBarChartDataProviderSettings.from = new Date(kWhDailyBarChartDataProviderSettings.to.getTime() - 1000*60*60*24*7);
                               $("#simpleTimePeriodType").val("DAYS");
                               if($("#simpleTimePeriodType").selectmenu != undefined)
                                   $("#simpleTimePeriodType").selectmenu('refresh', true);
                               kWhDailyBarChartDataProviderSettings.timePeriodType = "DAYS";        

                           }else if(value == "2"){
                               kWhDailyBarChartDataProviderSettings.to = new Date();
                               //Subtract 30 Days
                               kWhDailyBarChartDataProviderSettings.from = new Date(kWhDailyBarChartDataProviderSettings.to.getTime() - 1000*60*60*24*30);
                               $("#simpleTimePeriodType").val("DAYS");
                               if($("#simpleTimePeriodType").selectmenu != undefined)
                                   $("#simpleTimePeriodType").selectmenu('refresh', true);
                               kWhDailyBarChartDataProviderSettings.timePeriodType = "DAYS";        
                           }else if(value == "3"){ //This Year
                               kWhDailyBarChartDataProviderSettings.to = new Date();
                               //Set Date to first of year
                               kWhDailyBarChartDataProviderSettings.from = new Date(new Date().getFullYear(), 0, 1);
                               kWhDailyBarChartDataProviderSettings.from.setHours(0,0,0,0);
                               $("#simpleTimePeriodType").val("MONTHS");
                               if($("#simpleTimePeriodType").selectmenu != undefined)
                                   $("#simpleTimePeriodType").selectmenu('refresh', true);
                               kWhDailyBarChartDataProviderSettings.timePeriodType = "MONTHS";        
                           }
                           $("#kWhToDate").val(kWhDailyBarChartDataProviderSettings.to);
                           $("#kWhFromDate").val(kWhDailyBarChartDataProviderSettings.from);
                           
                           kWhDailyBarChartDisplayManager.clear(false);
                           kWhDailyBarChartDisplayManager.refresh(null, kWhDailyBarChartDataProviderSettings);
                       }
                   }
                   );
           customPeriodSelect.create();
           
           
           var customTimePeriodTypeSelect = new SelectConfiguration('simpleTimePeriodType',
                   {options: [
                              {label: 'Hourly', value: "HOURS"},
                              {label: 'Daily', value: "DAYS"},
                              {label: 'Monthly', value: "MONTHS"},
                              ]
                   },
                   {
                       onChange: function(value,owner){
                           console.log("customPeriodType: " + value);
                           kWhDailyBarChartDataProviderSettings.timePeriodType = value;
                           //Refresh display
                           kWhDailyBarChartDisplayManager.clear(false);
                           kWhDailyBarChartDisplayManager.refresh(null, kWhDailyBarChartDataProviderSettings);
                       }
                   }
                   );
           customTimePeriodTypeSelect.create();
           
       });
       
       