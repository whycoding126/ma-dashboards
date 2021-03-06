/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['amcharts/pie', 'jquery'], function(AmCharts, $) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maPieChart
 * @restrict E
 * @description
 * `<ma-pie-chart style="height: 300px; width: 600px" values="values"></ma-pie-chart>`
 * - This directive will display a pie chart for visualizing ratios.
 * - Values are provided as an array of objects.
 * - Note, you will need to set a width and height on the element.
 * - <a ui-sref="dashboard.examples.charts.pieChart">View Demo</a>
 *
 * @param {array} values Takes in an array of value objects to use in the pie chart. Each value object can contain the following properties:
<ul>
    <li>`value` - Numeric Value</li>
    <li>`text` - Text label</li>
    <li>`color` - Color of the pie piece</li>
</ul>
 * @param {object=} options extend AmCharts configuration object for customizing design of the chart (see [amCharts](https://www.amcharts.com/demos/simple-pie-chart/))
 * @param {object=} value-labels For use with the multi state data point render map. (see [multi-state pie chart demo](/modules/dashboards/web/mdAdmin/#/dashboard/examples/statistics/state-pie-chart))
 *
 * @usage
 * <ma-pie-chart style="height: 300px; width: 600px" values="[ { "value": 30, "text": "hot", "color": "#ff9300" }, { "value": 70, "text": "cold", "color": "#942192" } ]"
 options="{depth3D:15,angle:30}"></ma-pie-chart>
 *
 */
function pieChart($http) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          values: '=',
          valueLabels: '=?',
          options: '=?'
        },
        template: '<div class="amchart"></div>',
        link: function ($scope, $element, attributes) {
            var options = $.extend(defaultOptions(), $scope.options);
            var chart = AmCharts.makeChart($element[0], options);

            var labelFn = createLabelFn();
            $scope.$watchCollection('valueLabels', function(value) {
                labelFn = createLabelFn(value);
            });

            $scope.$watchCollection('values', function(newValue, oldValue) {
                var values = $.extend(true, [], newValue);

                for (var i = 0; i < values.length; i++) {
                    var item = values[i];

                    if (item.runtime) {
                        item.id = item.value;
                        item.value = item.runtime / 1000;
                        delete item.runtime;
                    }

                    labelFn(item);
                }

                chart.dataProvider = values;
                chart.validateData();
            });

            function createLabelFn(labels) {
                return function(item) {
                    var label = labels && labels[item.id] || {};

                    item.text = typeof label === 'string' ? label : label.text || item.text || item.id;
                    item.color = label.color || label.colour || item.color || item.colour;
                };
            }
        }
    };
}

function defaultOptions() {
    return {
        type: "pie",
        theme: "light",
        dataProvider: [],
        valueField: "value",
        titleField: "text",
        colorField: "color",
        balloon:{
            fixedPosition:true
        },
        'export': {
          enabled: true
        }
    };
}

pieChart.$inject = ['$http'];
return pieChart;

}); // define
