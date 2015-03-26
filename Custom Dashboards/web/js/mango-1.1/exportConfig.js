/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['amcharts/exporting/amexport', 'amcharts/exporting/canvg', 'amcharts/exporting/rgbcolor', 'amcharts/exporting/filesaver',
        'amcharts/exporting/jspdf', 'amcharts/exporting/jspdf.plugin.addimage'], function() {

var amExport = {
        top     : 0,
        right       : 0,
        exportJPG   : true,
        exportPNG   : true,
        exportSVG   : true,

        // Advanced configuration
        userCFG: {
            menuTop     : 'auto',
            menuLeft    : 'auto',
            menuRight   : '0px',
            menuBottom  : '0px',
            menuItems   : [{
                textAlign : 'center',
                icon      : '../amcharts/images/export.png',
                iconTitle : 'Save chart as an image',
                onclick   : function () {},
                items     : [{
                    title: 'JPG',
                    format: 'jpg'
                }, {
                    title: 'PNG',
                    format: 'png'
                }, {
                    title: 'SVG',
                    format: 'svg'
                }, {
                    title: 'PDF',
                    format: 'pdf'
                }]
            }],
            menuItemStyle: {
                backgroundColor     : 'transparent',
                opacity         : 1,
                rollOverBackgroundColor : '#EFEFEF',
                color           : '#000000',
                rollOverColor       : '#CC0000',
                paddingTop      : '6px',
                paddingRight        : '6px',
                paddingBottom       : '6px',
                paddingLeft     : '6px',
                marginTop       : '0px',
                marginRight     : '0px',
                marginBottom        : '0px',
                marginLeft      : '0px',
                textAlign       : 'left',
                textDecoration      : 'none',
                fontFamily      : 'Arial', // Default: charts default
                fontSize        : '12px', // Default: charts default
            },
            menuItemOutput: {
                backgroundColor     : '#FFFFFF',
                fileName        : 'amCharts',
                format          : 'png',
                output          : 'dataurlnewwindow',
                render          : 'browser',
                dpi         : 90,
                onclick         : function(instance, config, event) {
                    event.preventDefault();
                    instance.output(config);
                }
            },
            legendPosition: "bottom", //top,left,right
            removeImagery: true
        }
};

var amChart = {
    amExport: amExport
};

return amChart;

});
