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
               'kwhLineChartDiv', //Chart DIV id
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
               'ampsLineChartDiv', //Chart DIV id
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
                valueField: 'voltsC'
            }]
    });
    displayConfigurations.push(voltsLineChart);
       
    /**
     * This is the Volts line chart that also shows statistics al
     */
    var powerFactorLineChart = new  SerialChartConfiguration(
            'powerFactorLineChartDiv', //Chart DIV id
            /*
            * List of data provider Ids for this chart
            */
            [23,24,25], 
         /**
         *AmChart Styles fo a chart.
         */
            {
        titles: [{
            id: "Title-1",
            size: 15,
            text: "Power Factor"
        }],
        categoryField: "timestamp",
        color: "whitesmoke",
        graphs: [{
            title: "Power Factor A",
            valueAxis: "pfA-axis",
            bullet: "square",
            bulletSize: 6,
            lineColor: "green",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "pfA"
        },{              
            title: "Power Factor B",
            valueAxis: "pfB-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "red",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "pfB"
        },{              
            title: "Power Factor C",
            valueAxis: "pfC-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "yellow",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "pfC"
        }],
        valueAxes: [{
            id: "pfA-axis",
            title: " Power Factor A ",
            position: "left",
            color: "green"
        },{
            id: "pfB-axis",
            title: " Power Factor B ",
            position: "right",
            color: "red"
        },{
            id: "pfC-axis",
            title: " Power Factor C ",
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
                nameEndsWith: 'Power Factor A',
                valueField: 'pfA' 
            },{
                nameEndsWith: 'Power Factor B',
                valueField: 'pfB'
            },{
                nameEndsWith: 'Power Factor C',
                valueField: 'pfC'
            }]
    });
    displayConfigurations.push(powerFactorLineChart);   
 
    
    /**
     * This is the Volts line chart that also shows statistics al
     */
    var phaseALineChart = new  SerialChartConfiguration(
            'phaseALineChartDiv', //Chart DIV id
            /*
            * List of data provider Ids for this chart
            */
            [5,11,17,23], 
         /**
         *AmChart Styles fo a chart.
         */
            {
        titles: [{
            id: "Title-1",
            size: 15,
            text: "Phase A"
        }],
        categoryField: "timestamp",
        color: "whitesmoke",
        graphs: [{
            title: "Amps",
            valueAxis: "amps-axis",
            bullet: "square",
            bulletSize: 6,
            lineColor: "green",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "amps"
        },{              
            title: "Voltage",
            valueAxis: "volts-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "red",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "volts"
        },{              
            title: "Power",
            valueAxis: "power-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "yellow",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "power"
        },{              
            title: "Power Factor",
            valueAxis: "powerFactor-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "blue",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "powerFactor"
        }],
        valueAxes: [{
            id: "amps-axis",
            title: " Amps ",
            position: "left",
            color: "green"
        },{
            id: "volts-axis",
            title: " Voltage ",
            position: "right",
            color: "red"
        },{
            id: "power-axis",
            title: " Real Power ",
            position: "left",
            color: "yellow"
        },{
            id: "powerFactor-axis",
            title: " Power Factor ",
            position: "right",
            color: "blue"
        }
        ],
    },{
    },{
        /*
        * Setting Multi-series chart to create mappings from point to a graph valueField
        */
        dataPointMappings: [{
                nameEndsWith: '(A)',
                valueField: 'amps' 
            },{
                nameEndsWith: '(V)',
                valueField: 'volts'
            },{
                nameEndsWith: '(kW)',
                valueField: 'power'
            },{
                nameStartsWith: 'Power Factor',
                valueField: 'powerFactor'
            }]
    });
    displayConfigurations.push(phaseALineChart);   
    
    /**
     * This is the Volts line chart that also shows statistics al
     */
    var phaseBLineChart = new  SerialChartConfiguration(
            'phaseBLineChartDiv', //Chart DIV id
            /*
            * List of data provider Ids for this chart
            */
            [6,12,18,24], 
         /**
         *AmChart Styles fo a chart.
         */
            {
        titles: [{
            id: "Title-1",
            size: 15,
            text: "Phase B"
        }],
        categoryField: "timestamp",
        color: "whitesmoke",
        graphs: [{
            title: "Amps",
            valueAxis: "amps-axis",
            bullet: "square",
            bulletSize: 6,
            lineColor: "green",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "amps"
        },{              
            title: "Voltage",
            valueAxis: "volts-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "red",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "volts"
        },{              
            title: "Power",
            valueAxis: "power-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "yellow",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "power"
        },{              
            title: "Power Factor",
            valueAxis: "powerFactor-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "blue",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "powerFactor"
        }],
        valueAxes: [{
            id: "amps-axis",
            title: " Amps ",
            position: "left",
            color: "green"
        },{
            id: "volts-axis",
            title: " Voltage ",
            position: "right",
            color: "red"
        },{
            id: "power-axis",
            title: " Real Power ",
            position: "left",
            color: "yellow"
        },{
            id: "powerFactor-axis",
            title: " Power Factor ",
            position: "right",
            color: "blue"
        }
        ],
    },{
    },{
        /*
        * Setting Multi-series chart to create mappings from point to a graph valueField
        */
        dataPointMappings: [{
                nameEndsWith: '(A)',
                valueField: 'amps' 
            },{
                nameEndsWith: '(V)',
                valueField: 'volts'
            },{
                nameEndsWith: '(kW)',
                valueField: 'power'
            },{
                nameStartsWith: 'Power Factor',
                valueField: 'powerFactor'
            }]
    });
    displayConfigurations.push(phaseBLineChart);  
    
    /**
     * This is the Volts line chart that also shows statistics al
     */
    var phaseCLineChart = new  SerialChartConfiguration(
            'phaseCLineChartDiv', //Chart DIV id
            /*
            * List of data provider Ids for this chart
            */
            [7,13,19,25], 
         /**
         *AmChart Styles fo a chart.
         */
            {
        titles: [{
            id: "Title-1",
            size: 15,
            text: "Phase C"
        }],
        categoryField: "timestamp",
        color: "whitesmoke",
        graphs: [{
            title: "Amps",
            valueAxis: "amps-axis",
            bullet: "square",
            bulletSize: 6,
            lineColor: "green",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "amps"
        },{              
            title: "Voltage",
            valueAxis: "volts-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "red",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "volts"
        },{              
            title: "Power",
            valueAxis: "power-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "yellow",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "power"
        },{              
            title: "Power Factor",
            valueAxis: "powerFactor-axis",
            bullet: "round",
            bulletSize: 6,
            lineColor: "blue",
            lineThickness: 1,
            negativeLineColor: "red",
            type: "smoothedLine",
            valueField: "powerFactor"
        }],
        valueAxes: [{
            id: "amps-axis",
            title: " Amps ",
            position: "left",
            color: "green"
        },{
            id: "volts-axis",
            title: " Voltage ",
            position: "right",
            color: "red"
        },{
            id: "power-axis",
            title: " Real Power ",
            position: "left",
            color: "yellow"
        },{
            id: "powerFactor-axis",
            title: " Power Factor ",
            position: "right",
            color: "blue"
        }
        ],
    },{
    },{
        /*
        * Setting Multi-series chart to create mappings from point to a graph valueField
        */
        dataPointMappings: [{
                nameEndsWith: '(A)',
                valueField: 'amps' 
            },{
                nameEndsWith: '(V)',
                valueField: 'volts'
            },{
                nameEndsWith: '(kW)',
                valueField: 'power'
            },{
                nameStartsWith: 'Power Factor',
                valueField: 'powerFactor'
            }]
    });
    displayConfigurations.push(phaseCLineChart);  
    
    
    //For this example we will use a SimpleDisplay to fill a table with values
    var statisticsDisplay = new SimpleDisplayConfiguration([26,27,28,29,30,31,32,33,34,35,36,37,38], 
            {
               onClear: function(){
                   //Do anything required to clear our display
                   $('#statisticsTableBody').empty();
               },
               onLoad: function(data, dataPoint){
                   //Do anything required to fills our display with data
                   if(data.hasData == true){
                       $('#statisticsTableBody').append(
                               "<tr><td>" + dataPoint.name + 
                               "</td><td>" + this.renderValue(data.average) +
                               "</td><td>" + this.renderValue(data.integral) +
                               "</td><td>" + this.renderValue(data.sum) +
                               "</td><td>" + this.renderValue(data.count) +
                               "</td><td>" + this.renderPointValueTime(data.minimum) +
                               "</td><td>" + this.renderPointValueTime(data.maximum) +
                               "</td></tr>");
                   }
                   
               },
               renderPointValueTime: function(pvt){
                   return this.renderValue(pvt.value) + " @ " + this.renderTime(pvt.timestamp);  
                },
                
                renderValue: function(number){
                    return number.toFixed(2);
                },
                
                renderTime: function(time){
                   return new Date(time);
                }
            }); //Just assign data provider ids
    displayConfigurations.push(statisticsDisplay);
