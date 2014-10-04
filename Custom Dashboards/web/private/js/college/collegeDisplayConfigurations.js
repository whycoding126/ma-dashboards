//Global Defines for colors
var phaseACurrentColor = "red";
var phaseBCurrentColor = "green";
var phaseCCurrentColor = "blue";
var voltsANColor = "red";
var voltsBNColor = "green";
var voltsCNColor = "blue";
var powerFactorAColor = "red";
var powerFactorBColor = "green";
var powerFactorCColor = "blue";
var realPowerAColor = "red";
var realPowerBColor = "green";
var realPowerCColor = "blue";

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
               
//               //Function to render the text inside the balloons
//               //TODO Make this bulletproof and create a way to get a default 'graph'
//               balloonFunction: function(graphDataItem, amGraph){
//                   if(typeof graphDataItem.values != 'undefined'){
//                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
//                   }else{
//                       return "";
//                   }
//               },
               
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
     * Amps Bar Chart  w/Real Time Point Value Data Providers
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
                 rotate: true,
                 categoryField: "name",
                 startEffect: "bounce",
                 autoMargins: false,
                 marginLeft: 0,
                 marginRight: 0,
                 marginTop: 0,
                 marginBottom: 0,
                 chartCursor: null,
                 chartScrollbar: null,
                 legend: null,
                 categoryAxis: {
                     gridPosition: "start",
                     labelRotation: 45
                 },
                 graphs: [
                            {
                                showBalloon: true,
                                labelText:  '[[value]]',
                                fillAlphas: 1,
                                lineAlpha: 1,
                                type: "column",
                                valueField: "value",
                                colorField: "color"
                            }
                        ],
                guides: [],
                valueAxes: [
                    {
                        axisAlpha: 0,
                        gridAlpha: 0,
                    }
                ]
                 
     },{//Empty Mango Chart Mixins
         
         onLoad: function(data, dataPoint){

             if(data.length == 0)
                 return; //No data (shouldn't happen)
             
             var value = data[0].value.toFixed(1);
             var valueAttribute="value",color;
             if(dataPoint.name.indexOf("Phase A") >= 0){
                 color = phaseACurrentColor;
             }else if(dataPoint.name.indexOf("Phase B") >= 0){
                 color = phaseBCurrentColor;
             }else if(dataPoint.name.indexOf("Phase C") >= 0){
                 color = phaseCCurrentColor;
             }
             
             
             //Check to see if it already exists in the chart
             for(var i=0; i<this.amChart.dataProvider.length; i++){
                 if(this.amChart.dataProvider[i].xid == dataPoint.xid){
                     this.amChart.dataProvider[i][valueAttribute] = value;
                     this.amChart.validateData();
                     return; //Done
                 }
             }
             //We didn't find our set, so add a brand new one
             var entry = { xid: dataPoint.xid, name: dataPoint.name, color: color};
             entry[valueAttribute] =  value;
             this.amChart.dataProvider.push(entry);
             this.amChart.validateData();  
         }
         
     },{
     });
     displayConfigurations.push(ampsBarChart);
     
     /**
      * Volts Bar Chart  w/Real Time Point Value Data Providers
      */
      var voltsBarChart = new BarChartConfiguration(
              'voltsBarChartDiv',
              /*
              * List of data provider Ids for this chart
              */
              [8,9,10],
               /**
               * Start AmChart Styling
               */
              {
                  rotate: true,
                  categoryField: "name",
                  startEffect: "bounce",
                  autoMargins: false,
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  chartCursor: null,
                  chartScrollbar: null,
                  legend: null,
                  categoryAxis: {
                      gridPosition: "start",
                      labelRotation: 45
                  },
                  graphs: [
                             {
                                 showBalloon: true,
                                 labelText:  '[[value]]',
                                 fillAlphas: 1,
                                 lineAlpha: 1,
                                 type: "column",
                                 valueField: "value",
                                 colorField: "color"
                             }
                         ],
                 guides: [],
                 valueAxes: [
                     {
                         axisAlpha: 0,
                         gridAlpha: 0,
                     }
                 ]
                  
      },{//Empty Mango Chart Mixins
          
          onLoad: function(data, dataPoint){

              if(data.length == 0)
                  return; //No data (shouldn't happen)
              
              var value = data[0].value.toFixed(1);
              
              var valueAttribute = "value",color;
              if(dataPoint.name.indexOf("Voltage A-N") >= 0){
                  color = voltsANColor;
              }else if(dataPoint.name.indexOf("Voltage B-N") >= 0){
                  color = voltsBNColor;
              }else if(dataPoint.name.indexOf("Voltage C-N") >= 0){
                  color = voltsCNColor;
              }
              
              
              //Check to see if it already exists in the chart
              for(var i=0; i<this.amChart.dataProvider.length; i++){
                  if(this.amChart.dataProvider[i].xid == dataPoint.xid){
                      this.amChart.dataProvider[i][valueAttribute] = value;
                      this.amChart.validateData();
                      return; //Done
                  }
              }
              //We didn't find our set, so add a brand new one
              var entry = { xid: dataPoint.xid, name: dataPoint.name, color: color};
              entry[valueAttribute] =  value;
              this.amChart.dataProvider.push(entry);
              this.amChart.validateData();  
          }
          
      },{
      });
      displayConfigurations.push(voltsBarChart);     
     
      /**
       * Real Power Bar Chart  w/Real Time Point Value Data Providers
       */
       var realPowerBarChart = new BarChartConfiguration(
               'kwBarChartDiv',
               /*
               * List of data provider Ids for this chart
               */
               [14,15,16],
                /**
                * Start AmChart Styling
                */
               {
                   rotate: true,
                   categoryField: "name",
                   startEffect: "bounce",
                   autoMargins: false,
                   marginLeft: 0,
                   marginRight: 0,
                   marginTop: 0,
                   marginBottom: 0,
                   chartCursor: null,
                   chartScrollbar: null,
                   legend: null,
                   categoryAxis: {
                       gridPosition: "start",
                       labelRotation: 45
                   },
                   graphs: [
                              {
                                  showBalloon: true,
                                  labelText:  '[[value]]',
                                  fillAlphas: 1,
                                  lineAlpha: 1,
                                  type: "column",
                                  valueField: "value",
                                  colorField: "color"
                              }
                          ],
                  guides: [],
                  valueAxes: [
                      {
                          axisAlpha: 0,
                          gridAlpha: 0,
                      }
                  ]
                   
       },{//Empty Mango Chart Mixins
           
           onLoad: function(data, dataPoint){

               if(data.length == 0)
                   return; //No data (shouldn't happen)
               
               var value = data[0].value.toFixed(1);
               var valueAttribute = "value",color;
               if(dataPoint.name.indexOf("Real Power A") >= 0){
                   color = realPowerAColor;
               }else if(dataPoint.name.indexOf("Real Power B") >= 0){
                   color = realPowerBColor;
               }else if(dataPoint.name.indexOf("Real Power C") >= 0){
                   color = realPowerCColor;
               }
               
               
               //Check to see if it already exists in the chart
               for(var i=0; i<this.amChart.dataProvider.length; i++){
                   if(this.amChart.dataProvider[i].xid == dataPoint.xid){
                       this.amChart.dataProvider[i][valueAttribute] = value;
                       this.amChart.validateData();
                       return; //Done
                   }
               }
               //We didn't find our set, so add a brand new one
               var entry = { xid: dataPoint.xid, name: dataPoint.name, color: color};
               entry[valueAttribute] =  value;
               this.amChart.dataProvider.push(entry);
               this.amChart.validateData();  
           }
           
       },{
       });
       displayConfigurations.push(realPowerBarChart);       
       

       /**
        * Power Factor Bar Chart  w/Real Time Point Value Data Providers
        */
        var powerFactorBarChart = new BarChartConfiguration(
                'powerFactorBarChartDiv',
                /*
                * List of data provider Ids for this chart
                */
                [20,21,22],
                 /**
                 * Start AmChart Styling
                 */
                {
                    rotate: true,
                    categoryField: "name",
                    startEffect: "bounce",
                    autoMargins: false,
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    chartCursor: null,
                    chartScrollbar: null,
                    legend: null,
                    categoryAxis: {
                        gridPosition: "start",
                        labelRotation: 45
                    },
                    graphs: [
                               {
                                   showBalloon: true,
                                   labelText:  '[[value]]',
                                   fillAlphas: 1,
                                   lineAlpha: 1,
                                   type: "column",
                                   valueField: "value",
                                   colorField: "color"
                               }
                           ],
                   guides: [],
                   valueAxes: [
                       {
                           axisAlpha: 0,
                           gridAlpha: 0,
                       }
                   ]
                    
        },{//Empty Mango Chart Mixins
            
            onLoad: function(data, dataPoint){

                if(data.length == 0)
                    return; //No data (shouldn't happen)
                
                var value = data[0].value.toFixed(1);
                var valueAttribute = "value",color;
                if(dataPoint.name.indexOf("Power Factor A") >= 0){
                    color = powerFactorAColor;
                }else if(dataPoint.name.indexOf("Power Factor B") >= 0){
                    color = powerFactorBColor;
                }else if(dataPoint.name.indexOf("Power Factor C") >= 0){
                    color = powerFactorCColor;
                }
                
                
                //Check to see if it already exists in the chart
                for(var i=0; i<this.amChart.dataProvider.length; i++){
                    if(this.amChart.dataProvider[i].xid == dataPoint.xid){
                        this.amChart.dataProvider[i][valueAttribute] = value;
                        this.amChart.validateData();
                        return; //Done
                    }
                }
                //We didn't find our set, so add a brand new one
                var entry = { xid: dataPoint.xid, name: dataPoint.name, color: color};
                entry[valueAttribute] =  value;
                this.amChart.dataProvider.push(entry);
                this.amChart.validateData();  
            }
            
        },{
        });
        displayConfigurations.push(powerFactorBarChart);
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
               [5,6,7],
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
     * This is the Volts line chart that also shows statistics al
     */
    var voltsLineChart = new  SerialChartConfiguration(
            'voltsLineChartDiv', //Chart DIV id
            /*
            * List of data provider Ids for this chart
            */
            [11,12,13], 
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
       
       
       
//       
//       /*
//       * Voltage Bar Chart for use with Statistics Data Providers
//       */
//       var voltageChart = new  SerialChartConfiguration(
//               'voltageChartDiv', //Chart DIV id
//               /*
//               * List of data provider Ids for this chart
//               */
//               [9,10,11],
//               /**
//               * Start AmChart Styling
//               */
//               {
//                   "categoryField": "xid",
//                   "color": "whitesmoke",
//                   "startEffect": "bounce",
//                   "graphs": [
//                              {
//                                  "balloonText": "Minimum:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-1",
//                                  "lineAlpha": 0.2,
//                                  "title": "Minimum",
//                                  "type": "column",
//                                  "valueField": "minimum"
//                              },
//                              {
//                                  "balloonText": "Maximum:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-2",
//                                  "lineAlpha": 0.2,
//                                  "title": "Maximum",
//                                  "type": "column",
//                                  "valueField": "maximum"
//                              },
//                              {
//                                  "balloonText": "Average:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-3",
//                                  "lineAlpha": 0.2,
//                                  "title": "Average",
//                                  "type": "column",
//                                  "valueField": "average"
//                              }
//                          ],
//                          "guides": [],
//                          "titles": [
//                        {
//                            "id": "Title-1",
//                            "size": 15,
//                            "text": "Voltage"
//                        }
//                    ],
//                          "valueAxes": [
//                              {
//                                  "id": "ValueAxis-1",
//                                  "position": "top",
//                                  "axisAlpha": 0,
//                                  "title": ""
//                              }
//                          ],
//       },{//Empty Mango Chart Mixins
//           categoryField: "xid", //What member of the data point to use as category label/separator
//       },{
//       });
//       displayConfigurations.push(voltageChart);
//       
//       
//           var kwhBarChart = new StatisticsBarChartConfiguration(
//               'kwhBarChartDiv',
//               /*
//               * List of data provider Ids for this chart
//               */
//               [12,13,14],
//               /**
//               * Start AmChart Styling
//               */
//               {
//                "categoryField": "name",
//                "rotate": false,
//                "color": "whitesmoke",
//                  "graphs": [
//                              {
//                                  "balloonText": "Minimum:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-1",
//                                  "lineAlpha": 0.2,
//                                  "title": "Minimum",
//                                  "type": "column",
//                                  "valueField": "minimum"
//                              },
//                              {
//                                  "balloonText": "Maximum:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-1",
//                                  "lineAlpha": 0.2,
//                                  "title": "Maximum",
//                                  "type": "column",
//                                  "valueField": "maximum"
//                              },
//                              {
//                                  "balloonText": "Average:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-2",
//                                  "lineAlpha": 0.2,
//                                  "title": "Average",
//                                  "type": "column",
//                                  "valueField": "average"
//                              },
//                               {
//                                  "balloonText": "Integral:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-3",
//                                  "lineAlpha": 0.2,
//                                  "title": "Integral",
//                                  "type": "column",
//                                  "valueField": "average"
//                              },
//                            {
//                                  "balloonText": "Sum:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-3",
//                                  "lineAlpha": 0.2,
//                                  "title": "Sum",
//                                  "type": "column",
//                                  "valueField": "average"
//                              },
//                          ],
//                          
//                          "guides": [],
//                              "titles": [
//                        {
//                            "id": "Title-1",
//                            "size": 15,
//                            "text": "Statistics"
//                        }
//                    ],
//                          
//                          
//                          "valueAxes": [
//                              {
//                                  "id": "ValueAxis-1",
//                                  "position": "top",
//                                  "axisAlpha": 0,
//
//                              }
//                          ],
//       },{//Empty Mango Chart Mixins
//           categoryField: "name", //What member of the data point to use as category label/separator
//       },{
//       });
//       displayConfigurations.push(kwhBarChart);
//
//
//
//
// var voltsBarChart = new BarChartConfiguration(
//               'voltsBarChartDiv',
//               /*
//               * List of data provider Ids for this chart
//               */
//               [15,16,17], 
//               /**
//               * Start AmChart Styling
//               */
//               { //AmChart Mixins
//                   "categoryField": "name",
//                   "rotate": true,
//                   "color": "whitesmoke",
//                   "graphs": [
//                              {
//                                  "balloonText": "Average:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-1",
//                                  "lineAlpha": 0.2,
//                                  "title": "Total",
//                                  "type": "column",
//                                  "valueField": "value",
//                                  "lineColor": "#4183D7"
//                              }
//                          ],
//                          "guides": [],
//                          "valueAxes": [
//                              {
//                                  "id": "ValueAxis-1",
//                                  "position": "top",
//                                  "axisAlpha": 0
//                              }
//                          ],
//       },{//Empty Mango Chart Mixins
//           categoryField: "name", //What member of the data point to use as category label/separator
//       },{
//       });
//       displayConfigurations.push(voltsBarChart);
//
//
//var kwBarChart = new BarChartConfiguration(
//               'kwBarChartDiv',
//               /*
//               * List of data provider Ids for this chart
//               */
//               [18,19,20],
//               /**
//               * Start AmChart Styling
//               */
//               {
//                   "categoryField": "name",
//                   "rotate": true,
//                   "color":"whitesmoke",
//                   "graphs": [
//                              {
//                                  "balloonText": "Average:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-1",
//                                  "lineAlpha": 0.2,
//                                  "title": "Total",
//                                  "type": "column",
//                                  "valueField": "value"
//                              }
//                          ],
//                          "guides": [],
//                          "valueAxes": [
//                              {
//                                  "id": "ValueAxis-1",
//                                  "position": "top",
//                                  "axisAlpha": 0
//                              }
//                          ],
//       },{//End AmChart Styles
//       
//           categoryField: "name", //What member of the data point to use as category label/separator
//       },{
//       });
//       displayConfigurations.push(kwBarChart);
//
//
//var powerFactorBarChart = new BarChartConfiguration(
//
//               'powerFactorBarChartDiv',
//                /*
//                * List of data provider Ids for this chart
//                */
//               [21,22,23],
//               /**
//               * Start AmChart Styling
//               */
//               {
//                   "categoryField": "name",
//                   "rotate": true,
//                   "color": "whitesmoke",
//                   "graphs": [
//                              {
//                                  "balloonText": "Average:[[value]]",
//                                  "fillAlphas": 0.8,
//                                  "id": "AmGraph-1",
//                                  "lineAlpha": 0.2,
//                                  "title": "Total",
//                                  "type": "column",
//                                  "valueField": "value",
//                                  "lineColor": "#A62B2B",
//                              }
//                          ],
//                          "guides": [],
//                          "valueAxes": [
//                              {
//                                  "id": "ValueAxis-1",
//                                  "position": "top",
//                                  "axisAlpha": 0
//                              }
//                          ],
//       },{//end amcharts styles
//       /**
//       * this is the member of the data point to use as category label/separator
//       * could be name xid or ?
//       */
//           categoryField: "name", 
//       },{
//       });
//       displayConfigurations.push(powerFactorBarChart);
//
//        /**
//        * This is the Volts line chart that also shows statistics al
//        */
//       var voltsLineChart = new  SerialChartConfiguration(
//               'voltsLineChartDiv', //Chart DIV id
//               /*
//               * List of data provider Ids for this chart
//               */
//               [24,25,26], 
//            /**
//            *AmChart Styles fo a chart.
//            */
//               {
//           titles: [{
//               id: "Title-1",
//               size: 15,
//               text: "Volts "
//           }],
//           categoryField: "timestamp",
//           color: "whitesmoke",
//           graphs: [{
//               title: "Volts A-N",
//               valueAxis: "voltsA-axis",
//               /*
//               *Function to render the text inside the balloons
//               */
//               //TODO Make this bulletproof and create a way to get a default 'graph'
//               balloonFunction: function(graphDataItem, amGraph){
//                   if(typeof graphDataItem.values != 'undefined'){
//                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
//                   }else{
//                       return "";
//                   }
//               },
//               bullet: "square",
//               bulletSize: 6,
//               lineColor: "green",
//               lineThickness: 1,
//               negativeLineColor: "red",
//               type: "smoothedLine",
//               valueField: "voltsA"
//           },{              
//               title: "Volts B-N",
//               valueAxis: "voltsB-axis",
//               /*
//               *Function to render the text inside the balloons
//               */
//               //TODO Make this bulletproof and create a way to get a default 'graph'
//               balloonFunction: function(graphDataItem, amGraph){
//                   if(typeof graphDataItem.values != 'undefined'){
//                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
//                   }else{
//                       return "";
//                   }
//               },
//               bullet: "round",
//               bulletSize: 6,
//               lineColor: "red",
//               lineThickness: 1,
//               negativeLineColor: "red",
//               type: "smoothedLine",
//               valueField: "voltsB"
//           },{              
//               title: "Volts C-N",
//               valueAxis: "voltsC-axis",
//               /**
//               * Function to render the text inside the balloons
//               */
//               //TODO Make this bulletproof and create a way to get a default 'graph'
//               balloonFunction: function(graphDataItem, amGraph){
//                   if(typeof graphDataItem.values != 'undefined'){
//                       return graphDataItem.category + "<br>" + graphDataItem.values.value.toFixed(2);
//                   }else{
//                       return "";
//                   }
//               },
//               bullet: "round",
//               bulletSize: 6,
//               lineColor: "yellow",
//               lineThickness: 1,
//               negativeLineColor: "red",
//               type: "smoothedLine",
//               valueField: "voltsC"
//           }],
//           valueAxes: [{
//               id: "voltsA-axis",
//               title: " Volts A-N ",
//               position: "left",
//               color: "green"
//           },{
//               id: "voltsB-axis",
//               title: " Volts B-N ",
//               position: "right",
//               color: "red"
//           },{
//               id: "voltsC-axis",
//               title: " Volts C-N ",
//               position: "right",
//               color: "yellow"
//           }
//           ],
//       },{
//       },{
//           /*
//           * Setting Multi-series chart to create mappings from point to a graph valueField
//           */
//           dataPointMappings: [{
//                   nameEndsWith: 'Voltage A-N (V)',
//                   valueField: 'voltsA' 
//               },{
//                   nameEndsWith: 'Voltage B-N (V)',
//                   valueField: 'voltsB'
//               },{
//                   nameEndsWith: 'Voltage C-N (V)',
//                   valueField: 'phaseC'
//               }]
//       });
//       displayConfigurations.push(voltsLineChart);
//       
//
//// END THE CHARTS
//
//
//       /**
//       * Seting up the statistics Display for a different page on mobile.  This is different then on desktop due to the page stacking of are toolkits
//       */
//       displayConfigurations.push(
//       
//       new StatisticsConfiguration(
//                'accumulator', 
//                [5]
//                )
//       );
//       
//       displayConfigurations.push(
//                new StatisticsConfiguration(
//                'currentPhaseA',
//                [6]
//            )
//        );  
//       
//       displayConfigurations.push(
//                new StatisticsConfiguration(
//                'currentPhaseB',
//                [7]
//            )
//        );    
//       
//       displayConfigurations.push(
//                new StatisticsConfiguration(
//                'currentPhaseC',
//                [8]
//            )
//        );    