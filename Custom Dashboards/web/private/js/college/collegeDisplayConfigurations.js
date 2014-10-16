//Global Defines for colors
var phaseACurrentColor = "#f45749";
var phaseBCurrentColor = "#18bc62";
var phaseCCurrentColor = "#F4D03F";
var voltsANColor = "#f45749";
var voltsBNColor = "#18bc62";
var voltsCNColor = "#F4D03F";
var powerFactorAColor = "#f45749";
var powerFactorBColor = "#18bc62";
var powerFactorCColor = "#F4D03F";
var realPowerAColor = "#f45749";
var realPowerBColor = "#18bc62";
var realPowerCColor = "#F4D03F";
var ampsA = "#26A65B";
var ampsB = "#C0392B";
var ampsC = "#F4D03F"
/**
 *Here is the Array that is used to push charts and other widgets to the DisplayManger
 */
var displayConfigurations = new Array();
var kwhChart = new SerialChartConfiguration('kwhLineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
               [1], { //AmChart Mixins
	  valueAxes: [
	{
	axisColor: "white",
	}
	],
		 
	categoryAxis: {
	color: "white",
	axisColor: "white",
	},
	chartScrollbar: null,
        legend: {
            showEntries: false
        },
        chartCursor: {
            "cursorColor": "#888888"
        },
        categoryField: "timestamp",
        color: "white",
        startEffect: "bounce",
        graphs: [{
            title: "Kilowatts",
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
	    valueAxis: "kwh-axis",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "value"
	  
	}],
	 
    });
displayConfigurations.push(kwhChart);
/**
 * Amps Bar Chart  w/Real Time Point Value Data Providers
 */
var ampsBarChart = new BarChartConfiguration('ampsBarChartDiv',
    /*
     * List of data provider Ids for this chart
     */
             [2, 3, 4],
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
//         // angle: 30,
//         depth3D: 5,
        categoryAxis: {
            gridPosition: "start",
            labelRotation: 45,
	    gridAlpha: 0,
        },
        graphs: [
            {
	        color:"white",
	        fontSize : 20,
                showBalloon: false,
                labelText: '[[value]]',
                fillAlphas: 1,
                lineAlpha: 0,
                type: "column",
                valueField: "value",
                colorField: "color",
// 		lineColor: ampsA,
//                 topRadius: 1.06,
                columnWidth: 0.72,
                            }
                        ],
        guides: [],
        valueAxes: [
            {
                axisAlpha: 0,
                gridAlpha: 0,
		maximum: 500,
                    }
                ]
    }, { //Empty Mango Chart Mixins
        onLoad: function(data, dataPoint) {
            if (data.length === 0) return; //No data (shouldn't happen)
            var value = data[0].value.toFixed(1);
            var valueAttribute = "value",
                color;
            if (dataPoint.name.indexOf("Phase A") >= 0) {
                color = ampsA;
            } else if (dataPoint.name.indexOf("Phase B") >= 0) {
                color = ampsB;
            } else if (dataPoint.name.indexOf("Phase C") >= 0) {
                color = ampsC ;
            }
            //Check to see if it already exists in the chart
            for (var i = 0; i < this.amChart.dataProvider.length; i++) {
                if (this.amChart.dataProvider[i].xid == dataPoint.xid) {
                    this.amChart.dataProvider[i][valueAttribute] =
                        value;
                    this.amChart.validateData();
                    return; //Done
                }
            }
            //We didn't find our set, so add a brand new one
            var entry = {
                xid: dataPoint.xid,
                name: dataPoint.name,
                color: color
            };
            entry[valueAttribute] = value;
            this.amChart.dataProvider.push(entry);
            this.amChart.validateData();
	    $('#activityIndicator').hide();  
	}
    }, {});
displayConfigurations.push(ampsBarChart);
/**
 * Volts Bar Chart  w/Real Time Point Value Data Providers
 */
var voltsBarChart = new BarChartConfiguration('voltsBarChartDiv',
    /*
     * List of data provider Ids for this chart
     */
              [8, 9, 10],
    /**
     * Start AmChart Styling
     */
    {
        color:"white",
	fontSize : 20,
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
        // angle: 30,
        //         depth3D: 5,

        categoryAxis: {
            gridPosition: "start",
            labelRotation: 45,
	    gridAlpha: 0,
	  
	},
        graphs: [
            {
	        color:"white",
                showBalloon: false,
                labelText: '[[value]]',
                fillAlphas: .9,
                lineAlpha: .2,
                type: "column",
                valueField: "value",
                colorField: "color",
                topRadius: 1.06,
                columnWidth: 0.72,
                            }
                         ],
        guides: [],
        valueAxes: [
            {
                axisAlpha: 0,
                gridAlpha: 0,
				maximum: 500,

                     }
                 ]
    }, { //Empty Mango Chart Mixins
        onLoad: function(data, dataPoint) {
            if (data.length === 0) return; //No data (shouldn't happen)
            var value = data[0].value.toFixed(1);
            var valueAttribute = "value",
                color;
            if (dataPoint.name.indexOf("Voltage A-N") >= 0) {
                color = voltsANColor;
            } else if (dataPoint.name.indexOf("Voltage B-N") >= 0) {
                color = voltsBNColor;
            } else if (dataPoint.name.indexOf("Voltage C-N") >= 0) {
                color = voltsCNColor;
            }
            //Check to see if it already exists in the chart
            for (var i = 0; i < this.amChart.dataProvider.length; i++) {
                if (this.amChart.dataProvider[i].xid == dataPoint.xid) {
                    this.amChart.dataProvider[i][valueAttribute] =
                        value;
                    this.amChart.validateData();
                    $('#activityIndicator').hide();  
		    return; //Done
                }
            }
            //We didn't find our set, so add a brand new one
            var entry = {
                xid: dataPoint.xid,
                name: dataPoint.name,
                color: color
            };
            entry[valueAttribute] = value;
            this.amChart.dataProvider.push(entry);
            this.amChart.validateData();
	    $('#activityIndicator').hide();  

        }
    }, {});
displayConfigurations.push(voltsBarChart);
/**
 * Real Power Bar Chart  w/Real Time Point Value Data Providers
 */
var realPowerBarChart = new BarChartConfiguration('kwBarChartDiv',
    /*
     * List of data provider Ids for this chart
     */
               [14, 15, 16],
    /**
     * Start AmChart Styling
     */
    {
        color:"white",
	fontSize : 20,
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
        // angle: 30,
        //         depth3D: 5,

        categoryAxis: {
            gridPosition: "start",
            labelRotation: 45,
	    gridAlpha: 0,
	    axisAlpha: 0,

	
	  
	},
        graphs: [
            {
                showBalloon: false,
		color:"white",
                labelText: '[[value]]',
                fillAlphas: .9,
                lineAlpha: .2,
                type: "column",
                valueField: "value",
                colorField: "color",
                topRadius: 1.06,
                columnWidth: 0.72,
                            }
                          ],
        guides: [],
        valueAxes: [
            {
                axisAlpha: 0,
                gridAlpha: 0,
		maximum: 500,

                      }
                  ]
    }, { //Empty Mango Chart Mixins
        onLoad: function(data, dataPoint) {
            if (data.length === 0) return; //No data (shouldn't happen)
            var value = data[0].value.toFixed(1);
            var valueAttribute = "value",
                color;
            if (dataPoint.name.indexOf("Real Power A") >= 0) {
                color = realPowerAColor;
            } else if (dataPoint.name.indexOf("Real Power B") >= 0) {
                color = realPowerBColor;
            } else if (dataPoint.name.indexOf("Real Power C") >= 0) {
                color = realPowerCColor;
            }
            //Check to see if it already exists in the chart
            for (var i = 0; i < this.amChart.dataProvider.length; i++) {
                if (this.amChart.dataProvider[i].xid == dataPoint.xid) {
                    this.amChart.dataProvider[i][valueAttribute] =
                        value;
                    this.amChart.validateData();
                    return; //Done
                }
            }
            //We didn't find our set, so add a brand new one
            var entry = {
                xid: dataPoint.xid,
                name: dataPoint.name,
                color: color
            };
            entry[valueAttribute] = value;
            this.amChart.dataProvider.push(entry);
            this.amChart.validateData();
	    $('#activityIndicator').hide();  
	}
    }, {});
displayConfigurations.push(realPowerBarChart);
/**
 * Power Factor Bar Chart  w/Real Time Point Value Data Providers
 */
var powerFactorBarChart = new BarChartConfiguration('powerFactorBarChartDiv',
    /*
     * List of data provider Ids for this chart
     */
                [20, 21, 22],
    /**
     * Start AmChart Styling
     */
    {
        categoryAxis: {
	    color: "white"
	},
        color:"white",
	fontSize : 20,
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
        // angle: 30,
        //         depth3D: 5,

        categoryAxis: {
            gridPosition: "start",
            labelRotation: 45,
	    gridAlpha: 0,
	  
	},
        graphs: [
            {
                showBalloon: false,
                labelText: '[[value]]',
                color:"white",
		fillAlphas: .9,
                lineAlpha: .2,
                type: "column",
                valueField: "value",
                colorField: "color",
                topRadius: 1.06,
                columnWidth: 0.72,
		
                            }
                           ],
        guides: [],
        valueAxes: [
            {
                axisAlpha: 0,
                gridAlpha: 0,
	        maximum: 1.7,
		
                       }
                   ]
    }, { //Empty Mango Chart Mixins
        onLoad: function(data, dataPoint) {
            if (data.length === 0) return; //No data (shouldn't happen)
            var value = data[0].value.toFixed(1);
            var valueAttribute = "value",
                color;
            if (dataPoint.name.indexOf("Power Factor A") >= 0) {
                color = powerFactorAColor;
            } else if (dataPoint.name.indexOf("Power Factor B") >= 0) {
                color = powerFactorBColor;
            } else if (dataPoint.name.indexOf("Power Factor C") >= 0) {
                color = powerFactorCColor;
            }
            //Check to see if it already exists in the chart
            for (var i = 0; i < this.amChart.dataProvider.length; i++) {
                if (this.amChart.dataProvider[i].xid == dataPoint.xid) {
                    this.amChart.dataProvider[i][valueAttribute] =
                        value;
                    this.amChart.validateData();
                    return; //Done
                }
            }
            //We didn't find our set, so add a brand new one
            var entry = {
                xid: dataPoint.xid,
                name: dataPoint.name,
                color: color
            };
            entry[valueAttribute] = value;
            this.amChart.dataProvider.push(entry);
            this.amChart.validateData();
	    $('#activityIndicator').hide();  
        }
    }, {});
displayConfigurations.push(powerFactorBarChart);
/**
 *AMPS Line Chart
 */
var ampsChart = new SerialChartConfiguration(
    /**
     * The Chart Id that is given to pass on to html
     */
    'ampsLineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
               [5, 6, 7],
    /**
     * Start AmChart Styling
     */
    {  valueAxes: [
	{
	axisColor: "white",
	}
	],
        categoryAxis: {
	   color: "white",
	   axisColor: "white",
},
	legend:{
	  color:"white",
	},
      	chartScrollbar: null,
        categoryField: "timestamp",
        color: "white",
        startEffect: "bounce",
        graphs: [{
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Amps Phase A",
            valueAxis: "phaseA-axis",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "phaseA"
           }, {
            showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
	    title: "Amps Phase B",
            valueAxis: "phaseB-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "phaseB"
           }, {
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Amps Phase C",
            valueAxis: "phaseC-axis",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "phaseC"
           }],
        /*
         * End style of AmCharts
         */
    }, {}, {
        /*
         *Multi-series chart so create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameEndsWith: 'Phase A (A)',
            valueField: 'phaseA'
               }, {
            nameEndsWith: 'Phase B (A)',
            valueField: 'phaseB'
               }, {
            nameEndsWith: 'Phase C (A)',
            valueField: 'phaseC'
               }]
    });
displayConfigurations.push(ampsChart);
/**
 * This is the Volts line chart that also shows statistics al
 */
var voltsLineChart = new SerialChartConfiguration('voltsLineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
            [11, 12, 13],
    /**
     *AmChart Styles fo a chart.
     */
    {  valueAxes: [
	{
	axisColor: "white",
	}
	],
        categoryAxis: {
	    color: "white",
		    axisColor: "white",
},
      	chartScrollbar: null,
        categoryField: "timestamp",
        color: "white",
        startEffect: "elastic",
        chartCursor: {
            "cursorColor": "#888888"
        },	
	legend:{
	  color:"white",
	},
        graphs: [{
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Volts A-N",
            valueAxis: "voltsA-axis",
            balloonColor: "#f45749",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "voltsA"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Volts B-N",
            balloonColor: "#18bc62",
            valueAxis: "voltsB-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "voltsB"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Volts C-N",
            valueAxis: "voltsC-axis",
            balloonColor: "#F4D03F",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "voltsC"
        }],
    }, {}, {
        /*
         * Setting Multi-series chart to create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameEndsWith: 'Voltage A-N (V)',
            valueField: 'voltsA'
            }, {
            nameEndsWith: 'Voltage B-N (V)',
            valueField: 'voltsB'
            }, {
            nameEndsWith: 'Voltage C-N (V)',
            valueField: 'voltsC'
            }]
    });
displayConfigurations.push(voltsLineChart);
/**
 * This is the Volts line chart that also shows statistics al
 */
var powerFactorLineChart = new SerialChartConfiguration(
    'powerFactorLineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
            [23, 24, 25],
    /**
     *AmChart Styles fo a chart.
     */
    {  valueAxes: [
	{
	axisColor: "white",
	}
	],
            categoryAxis: {
	    color: "white",
		    axisColor: "white",
},
      	chartScrollbar: null,
        chartCursor: {
            "cursorColor": "#888888"
        },
        categoryField: "timestamp",
        color: "white",
	legend:{
	  color:"white",
	},
        graphs: [{
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power Factor A",
            valueAxis: "pfA-axis",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "pfA"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power Factor B",
            valueAxis: "pfB-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "pfB"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power Factor C",
            valueAxis: "pfC-axis",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "pfC"
        }],
    }, {}, {
        /*
         * Setting Multi-series chart to create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameEndsWith: 'Power Factor A',
            valueField: 'pfA'
            }, {
            nameEndsWith: 'Power Factor B',
            valueField: 'pfB'
            }, {
            nameEndsWith: 'Power Factor C',
            valueField: 'pfC'
            }]
    });
displayConfigurations.push(powerFactorLineChart);
/**
 * This is the Volts line chart that also shows statistics al
 */
var phaseALineChart = new SerialChartConfiguration('phaseALineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
            [5, 11, 17, 23],
    /**
     *AmChart Styles fo a chart.
     */
    {      valueAxes: [
	{
	axisColor: "white",
	}
	], 
      categoryAxis: {
	    color: "white",
		    axisColor: "white",
},
      	chartScrollbar: null,
        chartCursor: {
            "cursorColor": "#888888"
        },
	legend:{
	  color:"white",
	},
        categoryField: "timestamp",
        color: "white",
        graphs: [{
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Amps",
            valueAxis: "amps-axis",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "amps"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Voltage",
            valueAxis: "volts-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "volts"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power",
            valueAxis: "power-axis",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "power"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power Factor",
            valueAxis: "powerFactor-axis",
            //bullet: "round",
            // bulletSize: 0,
            lineColor: "#3A539B",
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "powerFactor"
        }],
	
	valueAxes: [{
        id:"amps-axis",
        title: "Amps",
	titleColor:'white',
	axisColor: "green",
        axisThickness: 1,
        gridAlpha: 0	,
        axisAlpha: 1,
	offset: 70,
        position: "left"
    }, {
        id:"power-axis",
        title: "Power",
	titleColor:'white',
	axisColor: "yellow",
        axisThickness: 1,
        gridAlpha: 0,
        axisAlpha: 1,
        position: "right"
    }, {
        id:"powerFactor-axis",
        title: "PowerFactor",
	titleColor:'white',
	axisColor: "blue",
        axisThickness: 1,
        gridAlpha: 0,
        offset: 60,
        axisAlpha: 1,
        position: "right"
    },
    {
        id:"volts-axis",
        title: "Volts",
	axisColor: "red	",
        axisThickness: 1,
        gridAlpha: 0,
        offset: 0,
        axisAlpha: 1,
        position: "left"
    }],
	
	
	
	
	
	
	
    }, {}, {
        /*
         * Setting Multi-series chart to create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameEndsWith: '(A)',
            valueField: 'amps',
// 	    valueAxis: 'v1'  
	  
	}, {
            nameEndsWith: '(V)',
            valueField: 'volts',
// 	    valueAxis: 'v2'
            }, {
            nameEndsWith: '(kW)',
            valueField: 'power',
// 	    valueAxis: 'v3'
            }, {
            nameStartsWith: 'Power Factor',
            valueField: 'powerFactor',
// 	    valueAxis: 'v4'
            }]
    });
displayConfigurations.push(phaseALineChart);
/**
 * This is the Volts line chart that also shows statistics al
 */
var phaseBLineChart = new SerialChartConfiguration('phaseBLineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
            [6, 12, 18, 24],
    /**
     *AmChart Styles fo a chart.
     */
    {  valueAxes: [
	{
	axisColor: "white",
	}
	],
            categoryAxis: {
	    color: "white",
	   axisColor: "white",

	},
      	chartScrollbar: null,
        chartCursor: {
            "cursorColor": "#888888"
        },
	legend:{
	  color:"white",
	},
        categoryField: "timestamp",
        color: "white",
        graphs: [{
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Amps",
            valueAxis: "amps-axis",
            bullet: null,
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "amps"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Voltage",
            valueAxis: "volts-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            // fillAlphas: 0.4,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "volts"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power",
            valueAxis: "power-axis",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "power"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power Factor",
            valueAxis: "powerFactor-axis",
            lineColor: "#3A539B",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "powerFactor"
        }],
	valueAxes: [{
        id:"amps-axis",
        title: "Amps",
	titleColor:'white',
	axisColor: "green",
        axisThickness: 1,
        gridAlpha: 0	,
        axisAlpha: 1,
	offset: 70,
        position: "left"
    }, {
        id:"power-axis",
        title: "Power",
	titleColor:'white',
	axisColor: "yellow",
        axisThickness: 1,
        gridAlpha: 0,
        axisAlpha: 1,
        position: "right"
    }, {
        id:"powerFactor-axis",
        title: "PowerFactor",
	titleColor:'white',
	axisColor: "blue",
        axisThickness: 1,
        gridAlpha: 0,
        offset: 60,
        axisAlpha: 1,
        position: "right"
    },
    {
        id:"volts-axis",
        title: "Volts",
	axisColor: "red	",
        axisThickness: 1,
        gridAlpha: 0,
        offset: 0,
        axisAlpha: 1,
        position: "left"
    }],
    }, {}, {
        /*
         * Setting Multi-series chart to create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameEndsWith: '(A)',
            valueField: 'amps'
            }, {
            nameEndsWith: '(V)',
            valueField: 'volts'
            }, {
            nameEndsWith: '(kW)',
            valueField: 'power'
            }, {
            nameStartsWith: 'Power Factor',
            valueField: 'powerFactor'
            }]
    });
displayConfigurations.push(phaseBLineChart);
/**
 * This is the Volts line chart that also shows statistics al
 */
var phaseCLineChart = new SerialChartConfiguration('phaseCLineChartDiv', //Chart DIV id
    /*
     * List of data provider Ids for this chart
     */
            [7, 13, 19, 25],
    /**
     *AmChart Styles fo a chart.
     */
    {
      valueAxes: [
	{
	axisColor: "white",
	}
	],
      categoryAxis: {
	    color: "white",
	    axisColor: "white",
      },
      	chartScrollbar: null,
        chartCursor: {
            "cursorColor": "#888888"
        },
	legend:{
	  color:"white",
	},
        categoryField: "timestamp",
        color: "white",
        graphs: [{
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Amps",
            valueAxis: "amps-axis",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "amps"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Voltage",
            valueAxis: "volts-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "volts"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Power",
            valueAxis: "power-axis",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "power"
        }, {
	  	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "[[title]] <br /> value: [[value]]  Time: [[category]]",
            title: "Power Factor",
            valueAxis: "powerFactor-axis",
            lineColor: "#3A539B",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "powerFactor"
        }],
	valueAxes: [{
        id:"amps-axis",
        title: "Amps",
	titleColor:'white',
	axisColor: "green",
        axisThickness: 1,
        gridAlpha: 0	,
        axisAlpha: 1,
	offset: 70,
        position: "left"
    }, {
        id:"power-axis",
        title: "Power",
	titleColor:'white',
	axisColor: "yellow",
        axisThickness: 1,
        gridAlpha: 0,
        axisAlpha: 1,
        position: "right"
    }, {
        id:"powerFactor-axis",
        title: "PowerFactor",
	titleColor:'white',
	axisColor: "blue",
        axisThickness: 1,
        gridAlpha: 0,
        offset: 60,
        axisAlpha: 1,
        position: "right"
    },
    {
        id:"volts-axis",
        title: "Volts",
	axisColor: "red	",
        axisThickness: 1,
        gridAlpha: 0,
        offset: 0,
        axisAlpha: 1,
        position: "left"
    }],
    }, {}, {
        /*
         * Setting Multi-series chart to create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameEndsWith: '(A)',
            valueField: 'amps'
            }, {
            nameEndsWith: '(V)',
            valueField: 'volts'
            }, {
            nameEndsWith: '(kW)',
            valueField: 'power'
            }, {
            nameStartsWith: 'Power Factor',
            valueField: 'powerFactor'
            }]
    });
displayConfigurations.push(phaseCLineChart);

//For this example we will use a SimpleDisplay to fill a table with values
var statisticsDisplay = new SimpleDisplayConfiguration([26, 27, 28, 29, 30, 31,
    32, 33, 34, 35, 36, 37, 38], {
    onClear: function() {
        //Do anything required to clear our display
        $('#statisticsTableBody')
            .empty();
    },
    onLoad: function(data, dataPoint) {
        //Do anything required to fills our display with data
	// lets make this into a switch statement
 
    
//       if (dataPoint.name === "Current Phase B (A)"){
// 	  $('#statisticsTableBody').append(
// 		   "<tr>" +
// 		   "<td'>" + dataPoint.name +"</td>"+
// 		   "<td'>" + this.renderValue(data.average) +"</td>"+
// 		    "<td'>" + this.renderValue(data.count) + "</td>"+
// 		    "<td'>" + this.renderPointValueTime(data.minimum) + "</td>"+
// 		    "<td'>" + this.renderPointValueTime(data.maximum) + "</td>" +
// 		    "</tr>"
// 		 );  
// 		 }else if (data.hasData === true){
		$('#statisticsTableBody').append(
		  "<tr><td>" + dataPoint.name + "</td><td>" +
		  this.renderValue(data.average) +
                    "</td><td>" + this.renderValue(data.count) +
                    "</td><td>" + this.renderPointValueTime(data.minimum) +
                    "</td><td>" + this.renderPointValueTime(data.maximum) +
                    "</td></tr>");
//         }
	
    },
    renderPointValueTime: function(pvt) {
        return this.renderValue(pvt.value) + " @ " + this.renderTime(
            pvt.timestamp);
    },
    renderValue: function(number) {
        return number.toFixed(2);
    },
    renderTime: function(time) {
        return new Date(time);
    }
}); //Just assign data provider ids
displayConfigurations.push(statisticsDisplay);






var realPowerLineChart = new SerialChartConfiguration('kwLineChartDiv',
    /*
     * List of data provider Ids for this chart
     */
               [17, 18, 19],
    /**
     * Start AmChart Styling
     */
     {
      valueAxes: [
	{
	axisColor: "white",
	}
	],
      categoryAxis: {
	    color: "white",
	    axisColor: "white",
      },
      	chartScrollbar: null,
        chartCursor: {
            "cursorColor": "#888888"
        },
	legend:{
	  color:"white",
	},
        categoryField: "timestamp",
        color: "white",
        graphs: [{
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Real Power A",
            valueAxis: "power-A-axis",
            lineColor: "#18bc62",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "power-A"
        }, {
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Real Power B",
            valueAxis: "power-B-axis",
            lineColor: "#EF4836",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "power-B"
        }, {
	    showBalloon: true,
	    balloonFunction:null,
	    balloonText: "<b>[[title]]</b> <br /> <b>value:</b> [[value]]  <b>Time:</b> [[category]]",
            title: "Real Power C",
            valueAxis: "power-C-axis",
            lineColor: "#F5D76E",
            lineThickness: 1,
            negativeLineColor: "#96281B",
            type: "smoothedLine",
            valueField: "power-C"
        }],
	
     }, {}, {
        /*
         * Setting Multi-series chart to create mappings from point to a graph valueField
         */
        dataPointMappings: [{
            nameStartsWith: 'Real Power A',
            valueField: 'power-A'
            }, {
            nameStartsWith: 'Real Power B',
            valueField: 'power-B'
            }, {
            nameStartsWith: 'Real Power C',
            valueField: 'power-C'
            }]
    });
displayConfigurations.push(realPowerLineChart);

