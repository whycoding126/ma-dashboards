//Default to value from last midnight
var voltageDailyBarChartTo = new Date(); //Till now
var voltageDailyBarChartFrom = new Date();
voltageDailyBarChartFrom.setHours(0, 0, 0, 0);
var voltageDailyBarChartDataProviderSettings = {
    //Setup the Date/Rollups
    from: voltageDailyBarChartFrom,
    to: voltageDailyBarChartTo,
    rollup: 'AVERAGE',
    timePeriodType: 'HOURS',
    timePeriods: 1, //Always 1
};
//Setup a Display Manager for the Bar Chart
var voltageDisplayConfigurations = new Array();
//Setup The Bar Chart
//Create a bar chart for use with Point Value Data Providers
var voltageBarChart = new BarChartConfiguration('voltageDailyBarChartDiv', [1], //List of data provider Ids for this chart
    { //AmChart Mixins
        rotate: false,
        categoryField: "time",
        angle: 15,
        depth3D: 30,
        categoryAxis: {
            "gridPosition": "start",
            "labelRotation": 45,
            "color": "#888888",
        },
        legend: {
            showEntries: false
        },
        chartCursor: {
            "cursorColor": "#888888"
        },
        graphs: [
            {
                "balloonText": "Average:[[value]]",
                "fillAlphas": 0.8,
                "id": "AmGraph-1",
                "lineAlpha": 0.2,
                "title": "Total",
                "topRadius": 1.36,
                "columnWidth": 0.72,
                "lineColor": "#1115E1",
                "type": "column",
                "valueField": "value"
                              }
                          ],
        "guides": [],
        "valueAxes": [
            {
                "id": "ValueAxis-1",
                "position": "top",
                "axisAlpha": 0,
                "color": "#888888",
                              }
                          ],
    }, { //Empty Mango Chart Mixins
        /**
         * Default behaviour is to average them values
         * Data Provider Listener
         * On Data Provider load we add new data
         */
        onLoad: function(data, dataPoint) {
            //Create one entry for every piece of data
            for (var i = 0; i < data.length; i++) {
                //Format the Time Depending on the Rollup
                var time;
                if (voltageDailyBarChartDataProviderSettings.timePeriodType ==
                    'HOURS') time = new Date(data[i].timestamp)
                    .toLocaleTimeString();
                if (voltageDailyBarChartDataProviderSettings.timePeriodType ==
                    'DAYS') time = new Date(data[i].timestamp)
                    .toLocaleDateString();
                if (voltageDailyBarChartDataProviderSettings.timePeriodType ==
                    'MONTHS') time = new Date(data[i].timestamp)
                    .toLocaleDateString();
                var entry = {
                    time: time,
                    value: data[i].value
                };
                this.amChart.dataProvider.push(entry);
            }
            this.amChart.validateData();
        }
    }, {});
voltageDisplayConfigurations.push(voltageBarChart);
var voltageDailyBarChartDisplayManager = new DataDisplayManager(
    voltageDisplayConfigurations);
var voltageDailyBarDataProvider = new PointValueDataProvider(1, {
    manipulateData: function(pointValues, dataPoint) {
        var newData = new Array();
        if (pointValues.length === 0) return newData;
        var previous = pointValues[0]
            //Subtract previous value from current.
        for (var i = 1; i < pointValues.length; i++) {
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
    }
});
voltageDailyBarChartDisplayManager.addProvider(voltageDailyBarDataProvider); //Ensure we add our data provider
/*
 * Fires when the everything is ready to show
 */
$(document)
    .ready(function() {
        var voltagePerDayFromDate = new DateTimePickerConfiguration(
            'voltageFromDate', {}, {
                defaultValue: voltageDailyBarChartDataProviderSettings.from,
                owner: null,
                onChange: function(date) {
                    console.log("voltage From Date: " + date);
                    voltageDailyBarChartDataProviderSettings.from =
                        date;
                    voltageDailyBarChartDisplayManager.clear(false);
                    voltageDailyBarChartDisplayManager.refresh(null,
                        voltageDailyBarChartDataProviderSettings);
                }
            });
        voltagePerDayFromDate.create();
        var voltagePerDayToDate = new DateTimePickerConfiguration('voltageToDate', {}, {
            defaultValue: voltageDailyBarChartDataProviderSettings.to,
            owner: null,
            onChange: function(date) {
                console.log("voltage To Date: " + date);
                voltageDailyBarChartDataProviderSettings.to = date;
                voltageDailyBarChartDisplayManager.clear(false);
                voltageDailyBarChartDisplayManager.refresh(null,
                    voltageDailyBarChartDataProviderSettings);
            }
        });
        voltagePerDayToDate.create();
        //Setup The voltage Chart Area (Not using the Templater)
        var customPeriodSelect = new SelectConfiguration('simpleTimePicker', {
            options: [
                {
                    label: 'Today',
                    value: "0"
                },
                {
                    label: '7 Days',
                    value: "1"
                },
                {
                    label: '30 Days',
                    value: "2"
                },
                {
                    label: 'This Year',
                    value: "3"
                }
                              ]
        }, {
            onChange: function(value, owner) {
                console.log("customPeriod: " + value);
                if (value == "0") {
                    voltageDailyBarChartDataProviderSettings.from =
                        new Date();
                    voltageDailyBarChartDataProviderSettings.from.setHours(
                        0, 0, 0, 0);
                    voltageDailyBarChartDataProviderSettings.to =
                        new Date();
                    $("#simpleTimePeriodType")
                        .val("HOURS");
                    if ($("#simpleTimePeriodType")
                        .selectmenu !== undefined) $(
                            "#simpleTimePeriodType")
                        .selectmenu('refresh', true);
                    voltageDailyBarChartDataProviderSettings.timePeriodType =
                        "HOURS";
                } else if (value == "1") {
                    voltageDailyBarChartDataProviderSettings.to =
                        new Date();
                    //Subtract 7*24Hrs
                    voltageDailyBarChartDataProviderSettings.from =
                        new Date(
                            voltageDailyBarChartDataProviderSettings
                            .to.getTime() - 1000 * 60 * 60 * 24 *
                            7);
                    $("#simpleTimePeriodType")
                        .val("DAYS");
                    if ($("#simpleTimePeriodType")
                        .selectmenu !== undefined) $(
                            "#simpleTimePeriodType")
                        .selectmenu('refresh', true);
                    voltageDailyBarChartDataProviderSettings.timePeriodType =
                        "DAYS";
                } else if (value == "2") {
                    voltageDailyBarChartDataProviderSettings.to =
                        new Date();
                    //Subtract 30 Days
                    voltageDailyBarChartDataProviderSettings.from =
                        new Date(
                            voltageDailyBarChartDataProviderSettings
                            .to.getTime() - 1000 * 60 * 60 * 24 *
                            30);
                    $("#simpleTimePeriodType")
                        .val("DAYS");
                    if ($("#simpleTimePeriodType")
                        .selectmenu !== undefined) $(
                            "#simpleTimePeriodType")
                        .selectmenu('refresh', true);
                    voltageDailyBarChartDataProviderSettings.timePeriodType =
                        "DAYS";
                } else if (value == "3") { //This Year
                    voltageDailyBarChartDataProviderSettings.to =
                        new Date();
                    //Set Date to first of year
                    voltageDailyBarChartDataProviderSettings.from =
                        new Date(new Date()
                            .getFullYear(), 0, 1);
                    voltageDailyBarChartDataProviderSettings.from.setHours(
                        0, 0, 0, 0);
                    $("#simpleTimePeriodType")
                        .val("MONTHS");
                    if ($("#simpleTimePeriodType")
                        .selectmenu !== undefined) $(
                            "#simpleTimePeriodType")
                        .selectmenu('refresh', true);
                    voltageDailyBarChartDataProviderSettings.timePeriodType =
                        "MONTHS";
                }
                $("#voltageToDate")
                    .val(voltageDailyBarChartDataProviderSettings.to);
                $("#voltageFromDate")
                    .val(voltageDailyBarChartDataProviderSettings.from);
                voltageDailyBarChartDisplayManager.clear(false);
                voltageDailyBarChartDisplayManager.refresh(null,
                    voltageDailyBarChartDataProviderSettings);
            }
        });
        customPeriodSelect.create();
        var customTimePeriodTypeSelect = new SelectConfiguration(
            'simpleTimePeriodType', {
                options: [
                    {
                        label: 'Hourly',
                        value: "HOURS"
                    },
                    {
                        label: 'Daily',
                        value: "DAYS"
                    },
                    {
                        label: 'Monthly',
                        value: "MONTHS"
                    },
                              ]
            }, {
                onChange: function(value, owner) {
                    console.log("customPeriodType: " + value);
                    voltageDailyBarChartDataProviderSettings.timePeriodType =
                        value;
                    //Refresh display
                    voltageDailyBarChartDisplayManager.clear(false);
                    voltageDailyBarChartDisplayManager.refresh(null,
                        voltageDailyBarChartDataProviderSettings);
                }
            });
        customTimePeriodTypeSelect.create();
    });