/**
 * Javascript Object for the templating HTML pages.  
 * 
 * There are 2 sections, grouping and point configuration 
 *
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

MangoPointHierarchyTemplate = function(options){
    for(var i in options) {
        this[i] = options[i];
    }
    var _this = this;
    //Assign on change events to the selection drop downs
    if(this.allFoldersDropDownId != null)
        $('#' + this.allFoldersDropDownId).change(function(){
            _this.loadFolderMatchAll($(this).val());
        });
    
    if(this.groupsDropDownId != null)
        $('#' + this.groupsDropDownId).change(function(){
            _this.loadGroupMatchAll($(this).val());
        });

    //Create the Time Periods and Rollup if required
    if(this.rollupSelectId != null){
        
        for(k in this.rollups){
            $('#' + this.rollupSelectId).append( 
                    $("<option></option>").text(this.rollups[k]).val(this.rollups[k]));
        }
        //Add the onchange event
        
        for(k in this.timePeriods){
            $('#' + this.timePeriodTypeSelectId).append( 
                    $("<option></option>").text(this.timePeriods[k]).val(this.timePeriods[k]));
        }        
    }
    
    //Setup Date Pickers if necessary
    if(this.fromDateDivId != null)
        $('#' + this.fromDateDivId).datetimepicker({
            inline: true,
            format:'unixtime',
            defaultDate: this.fromDate,
            onChangeDateTime: function(dp, $input){
                //Use Unix ts for input value, dirty hack but we will eventually get rid of this picker
                _this.fromDate = new Date(parseInt($input.val(), 10) * 1000);
                
                if(_this.groupsDropDownId != null)
                    _this.loadGroupMatchAll($("#" + _this.groupsDropDownId).val());
                else
                    _this.loadFolderMatchAll($("#" + _this.allFoldersDropDownId).val());
            },
        });
    if(this.toDateDivId != null)
        $('#' + _this.toDateDivId).datetimepicker({
            inline: true,
            format: 'unixtime',
            defaultDate: this.toDate,
            onChangeDateTime:function(dp, $input){
              //Use Unix ts for input value, dirty hack but we will eventually get rid of this picker
                _this.toDate = new Date(parseInt($input.val(), 10) * 1000);
                if(_this.groupsDropDownId != null)
                    _this.loadGroupMatchAll($("#" + _this.groupsDropDownId).val());
                else
                    _this.loadFolderMatchAll($("#" + _this.allFoldersDropDownId).val());
            },
        });
    
    
    
    
    mangoRest.hierarchy.getRoot(function(data){
        _this.root = data; //Set the PH
        _this.loadAllPoints(); //Load all points from Hierarchy
        //Load the point hierarchy into some select lists
        if(_this.allFoldersDropDownId != null)
            _this.createAllFoldersDropDown(_this.allFoldersDropDownId);
        if(_this.groupsDropDownId != null)
            _this.createGroupDropDown(_this.groupsDropDownId);
        _this.loadNumericPointConfigs(_this.numericPoints);
    }, this.showError);
    
    
};

MangoPointHierarchyTemplate.prototype = {

        summaryChartId: null, //ID Of summary chart div
        errorDivId: "errors", //Div ID for error messages
        decimalPlaces: 2, //Default decimal places to use
        
        fromDate: null,
        toDate: null,
        
        root: null, //Point Hierarchy Root node
        pointConfigs: new Array(), //Array of point configurations
        groupConfigs: new Array(), //Array of group configurations
        pointGroups: new Array(),
        pointHierarchyMap: {}, //Map of folder IDs to Folder
        allDataPointSummaries: new Array(), //Holds all data points in Mango
        
        fromDateDivId: null,
        toDateDivId: null,
        
        rollups: ['AVERAGE', 'MAXIMUM', 'MINIMUM', 'SUM', 'FIRST', 'LAST', 'COUNT'],
        rollupSelectId: null,
        timePeriods: ['MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS'], //Not using yet 'MILLISECONDS', 'SECONDS',
        timePeriodTypeSelectId: null,
        timePeriodInputId: null,
        //Point Configurations
        numericPoints: new Array(),
        
        
        /**
         * Override method to return a custom data view
         */
        displayPointValueTime: function(pvt){
            return pvt.value.toFixed(this.decimalPlaces) + " @ " + pvt.time;
        },
        
        /**
         * Using an existing point configuration and an override layer
         * create a new config for that point
         * 
         * @param overrides
         * @param config
         * @returns New Merged Point Configuration
         */
        createNewPointConfig: function(overrides, config){
            
            var newConfig = {};
            $.extend(true, newConfig, config, overrides);

            return newConfig;
        },
        
        /**
         * TODO Fix this up with Promises?
         */
        loadNumericPointConfigs: function(overrides){
            var _this = this;
            //Load in the Point Configurations for Numeric Points
            mangoRest.getJson("/modules/dashboards/web/private/points/simpleNumeric.json", function(data){
                for(i in overrides)
                    _this.pointConfigs.push(_this.createNewPointConfig(overrides[i], data));
                
            }, this.showError);
        },
        
        /**
         * Create a new Group Config
         * @param overrides - A partially filled Group Config Object
         * @param config - Base configuration (not required)
         * @returns
         */
        newGroupConfig: function(overrides, config){
                var newConfig = {
                        matchAll: false,
                        byFolder: false,
                        byPointSummary: false,
                        matchConfig: {
                            label: null,
                            labelAttribute: null,
                            matchAttribute: null,
                            startsWith: null,
                            endsWith: null,
                        }
                }; 
                $.extend(true, newConfig, config, overrides);

                return newConfig;
            },
            
            /**
             * Create Group Drop Down List
             * @param divId - for group select list
             */
            createGroupDropDown: function(divId){
                $('#' + divId).append( $("<option></option>").text("Select One").val(0) );
                
                //Loop over all the configs and create groups
                for(i in this.groupConfigs){
                    var groupConfig = this.groupConfigs[i];

                    var newGroups = new Array();
                    if(groupConfig.matchAll){ //Match All Points
                        //Use all points for this group
                        var newGroup = {
                                points: new Array(),
                                label: groupConfig.matchConfig.label
                        };
                        newGroup.points.push.apply(newGroup.points, this.allDataPointSummaries);
                        newGroups.push(newGroup);
                    }else{
                        //Loop over all data points and create a group with them
                        var groupsMap = {};
                        for(j in this.allDataPointSummaries){
                            var summary = this.allDataPointSummaries[j];
                            
                            if(groupConfig.byFolder == true){ //Group By Folder
                                
                                //TODO Refactor to get the match attribute and then compare it
                                //Special case for path
                                if(groupConfig.matchConfig.matchAttribute == "path"){
                                    
                                    //Search the point hierarchy by path
                                    var path = this.getPointHierarchyPath(summary);
                                    
                                    //Just matching on name or ID 
                                    match = false;
                                    if(groupConfig.matchConfig.startsWith != null){
                                        if(path.indexOf(groupConfig.matchConfig.startsWith) == 0)
                                            match = true;
                                        else
                                            match = false;
                                    }
                                    if(groupConfig.matchConfig.endsWith != null){
                                        if(path.indexOf(groupConfig.matchConfig.endsWith, path.length - groupConfig.matchConfig.endsWith.length) !== -1)
                                            match = true;
                                        else
                                            match = false;
                                    }
                                    //If not matching then just group by attribute
                                    if((groupConfig.matchConfig.endsWith == null)&&(groupConfig.matchConfig.startsWith == null)){
                                        var group = groupsMap[path];
                                        if(group == null){
                                            var label;
                                            //Create Label First
                                            if(groupConfig.matchConfig.label == null){
                                                if(groupConfig.matchConfig.labelAttribute == "path")
                                                    label = path;
                                                else
                                                    label = this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.labelAttribute];
                                            }else{
                                                label = groupConfig.matchConfig.label;
                                            }
                                            //Create new group and add this point
                                            group = {
                                                    points: new Array(),
                                                    label: label
                                            }
                                            groupsMap[path] = group;
                                            
                                        }
                                        //Add to existing group
                                        group.points.push(summary);
                                    }
                                        
                                    //Did we have a match
                                    if(match){
                                        var group = groupsMap[path];
                                        if(group == null){
                                            //Create new group and add this point
                                            var label;
                                            //Create Label First
                                            if(groupConfig.matchConfig.label == null){
                                                if(groupConfig.matchConfig.labelAttribute == "path")
                                                    label = path;
                                                else
                                                    label = this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.labelAttribute];

                                            }else{
                                                label = groupConfig.matchConfig.label;
                                            }
                                            
                                            group = {
                                                    points: new Array(),
                                                    label: label,
                                            }
                                            groupsMap[path] = group;
                                          }
                                          //Add to existing group
                                          group.points.push(summary);
                                        }                                    

                                }else{
                                    //Just matching on name or ID 
                                    match = false;
                                    if(groupConfig.matchConfig.startsWith != null){
                                        if(this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.startsWith) == 0)
                                            match = true;
                                        else
                                            match = false;
                                    }
                                    if(groupConfig.matchConfig.endsWith != null){
                                        if(this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.endsWith, this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute].length - groupConfig.matchConfig.endsWith.length) !== -1)
                                            match = true;
                                        else
                                            match = false;
                                    }
                                    //If not matching then just group by attribute
                                    if((groupConfig.matchConfig.endsWith == null)&&(groupConfig.matchConfig.startsWith == null)){
                                        var group = groupsMap[this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute]];
                                        if(group == null){
                                            var label;
                                            //Create Label First
                                            if(groupConfig.matchConfig.label == null){
                                                label = this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.labelAttribute];
                                            }else{
                                                label = groupConfig.matchConfig.label;
                                            }
                                            //Create new group and add this point
                                            group = {
                                                    points: new Array(),
                                                    label: label
                                            }
                                            groupsMap[this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.matchAttribute]] = group;
                                            
                                        }
                                        //Add to existing group
                                        group.points.push(summary);
                                    }
                                        
                                    //Did we have a match
                                    if(match){
                                        var group = groupsMap[0];
                                        if(group == null){
                                            //Create new group and add this point
                                            var label;
                                            //Create Label First
                                            if(groupConfig.matchConfig.label == null){
                                                label = this.pointHierarchyMap[summary.pointFolderId][groupConfig.matchConfig.labelAttribute];
                                            }else{
                                                label = groupConfig.matchConfig.label;
                                            }
                                            
                                            group = {
                                                    points: new Array(),
                                                    label: label,
                                            }
                                            groupsMap[0] = group;
                                          }
                                          //Add to existing group
                                          group.points.push(summary);
                                        }                                    
                                }
                            }else if(groupConfig.byPointSummary == true){ //Match By Point Summary
                                match = false;
                                if(groupConfig.matchConfig.startsWith != null){
                                    if(summary[groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.startsWith) == 0)
                                        match = true;
                                    else
                                        match = false;
                                }
                                if(groupConfig.matchConfig.endsWith != null){
                                    if(summary[groupConfig.matchConfig.matchAttribute].indexOf(groupConfig.matchConfig.endsWith, summary[groupConfig.matchConfig.matchAttribute].length - groupConfig.matchConfig.endsWith.length) !== -1)
                                        match = true;
                                    else
                                        match = false;
                                }
                                //If not matching then just group by attribute
                                if((groupConfig.matchConfig.endsWith == null)&&(groupConfig.matchConfig.startsWith == null)){
                                    var group = groupsMap[summary[groupConfig.matchConfig.matchAttribute]];
                                    if(group == null){
                                        var label;
                                        //Create Label First
                                        if(groupConfig.matchConfig.label == null){
                                            label = summary[groupConfig.matchConfig.labelAttribute];
                                        }else{
                                            label = groupConfig.matchConfig.label;
                                        }
                                        //Create new group and add this point
                                        group = {
                                                points: new Array(),
                                                label: label
                                        }
                                        groupsMap[summary[groupConfig.matchConfig.matchAttribute]] = group;
                                        
                                    }
                                    //Add to existing group
                                    group.points.push(summary);
                                }
                                    
                                //Did we have a match
                                if(match){
                                    var group = groupsMap[0];
                                    if(group == null){
                                        //Create new group and add this point
                                        var label;
                                        //Create Label First
                                        if(groupConfig.matchConfig.label == null){
                                            label = summary[groupConfig.matchConfig.labelAttribute];
                                        }else{
                                            label = groupConfig.matchConfig.label;
                                        }
                                        
                                        group = {
                                                points: new Array(),
                                                label: label,
                                        }
                                        groupsMap[0] = group;
                                    }
                                    //Add to existing group
                                    group.points.push(summary);
                                }
                            }
                        }
                        //Add all the new groups
                        for(l in groupsMap){
                            newGroups.push(groupsMap[l]);
                        }
                    }
                    //Add the groups to the list
                    for(k in newGroups){
                        this.pointGroups.push(newGroups[k].points);
                        $('#' + divId).append( $("<option></option>").text(newGroups[k].label).val(this.pointGroups.length-1) );
                    }
                }
            },
            
            /**
             * Get the path for a given point
             */
            getPointHierarchyPath: function(summary){
                var paths = new Array();
                this.findPointInSubfolders(summary, this.root, paths);
                var result = "";
                if(paths.length == 1)
                    return "/"; //Hack for root folder 
                
                //Paths in reverse order so go backwards
                for(var i=paths.length-2; i>=0; i--)
                    result = result + paths[i] + "/";
                return result;
            },
            
            /**
             * Recursively check the folders for points
             */
            findPointInSubfolders: function(summary, folder, paths){
                var found = false;
                for(i in folder.points){
                    if(folder.points[i].xid == summary.xid){
                        found = true;
                        break;
                    }
                }
                
                //If we didn't find it check subfolders
                if(!found){
                    for(i in folder.subfolders){
                        found = this.findPointInSubfolders(summary, folder.subfolders[i], paths);
                        if(found)
                            break;
                    }
                }
                
                //If we found it add our path
                if(found)
                    paths.push(folder.name);
                
                return found;
            },
            
            /**
             * Load points from a group with the given index
             * @param index
             */
            loadGroupMatchAll: function(index){
                var group = this.pointGroups[index];
                this.loadPointsMatchAll(group);
            },
            
            /**
             * 
             * Create a drop down for all the folders
             * @param divId
             */
             createAllFoldersDropDown: function(divId){
                    $('#' + divId).append( $("<option></option>").text("Select One").val(0) );
                  //Put the sub folders into our select list on success
                  this.loadSubfolders(this.root, divId);
            },
            
            /**
             * Recursive Load of folders
             * @param folder
             */
            loadSubfolders: function(folder, divId){
                var _this = this;
                $.each(folder.subfolders, function() {
                    $('#' + divId).append(
                         $("<option></option>").text(this.name).val(this.id)
                    )
                    _this.loadSubfolders(this, divId);
               });
            },
            
            
            /**
             * Extract all points into the provided array
             * @param folder
             * @param allDataPointSummaries
             */
            loadAllPoints: function(){
                this.loadAllPointsRecursively(this.root);
            },
            
            /**
             * Extract all points into the provided array
             * @param folder
             * @param allDataPointSummaries
             */
            loadAllPointsRecursively: function(folder){
                var _this = this;
                $.each(folder.points, function() {
                    _this.allDataPointSummaries.push(this);
                });
                
                //Save into lookup
                this.pointHierarchyMap[folder.id] = folder;
                
                $.each(folder.subfolders, function() {
                    _this.loadAllPointsRecursively(this);
               });
            },
            
            /**
             * Load a Folder's points into the view by matching
             * all configurations to a point
             * @param folderId
             */
            loadFolderMatchAll: function(folderId){
                this.loadPointsMatchAll(this.pointHierarchyMap[folderId].points);
            },
            
            /**
             * Do the work of creating the UI by matching one point config
             * to many data points
             * @param dataPoints data point summaries
             */
            loadPointsMatchAll: function(dataPoints){
                var pointsForMasterChart = new Array();
                var _this = this;
                $.each(this.pointConfigs, function() {
                    var pointConfig = this;
                    var pointSummary = _this.matchPointConfig(pointConfig, dataPoints);
                    if(pointSummary != null){
                        //Use the Config to build the page
                        //Do we have a chart?
                        if(pointConfig.chart != null){
                            _this.createChart(pointConfig, pointSummary);
                        }
                        if(pointConfig.statistics != null){
                            _this.createStatistics(pointConfig, pointSummary);
                        }
                        if(pointConfig.chart.includeInSummary){
                            pointsForMasterChart.push(
                                    {
                                        config: pointConfig,
                                        dataPointSummary: pointSummary
                                    });
                        }
                    }else{
                        //No Error, its ok$("#errors").text("No points to match config: " + pointConfig);
                    }
                });
                //Now create a full chart with all points on it
                if((this.summaryChartId != null)&&(pointsForMasterChart.length > 0))
                    _this.createLineChartForAll(pointsForMasterChart, this.summaryChartId);
            },
            
            /**
             * Load a Folder's points into the view by 
             * using the first configuration that matches
             * @param folderId
             */
            loadFolderMatchOne: function(folderId){
                var _this = this;
                mangoRest.hierarchy.getFolderById(folderId, function(data){

                    var pointsForMasterChart = new Array();
                    
                    $.each(data.points, function() {
                        var pointSummary = this;
                        var pointConfig = _this.matchPointSummary(pointSummary, _this.pointConfigs);
                        if(pointConfig != null){
                            pointConfig.dataPointSummary = pointSummary;
                            //Use the Config to build the page
                            //Do we have a chart?
                            if(pointConfig.chart != null){
                                _this.createChart(pointConfig);
                            }
                            if(pointConfig.statistics != null){
                                _this.createStatistics(pointConfig);
                            }
                            if(pointConfig.chart.includeInSummary){
                                _this.pointsForMasterChart.push(pointConfig);
                            }
                            
                        }else{
                            $("#errors").text("Configuration not found for point with XID: " + pointSummary.xid);
                        }
                        
                   });
                    if(this.summaryChartId != null)
                        _this.createLineChartForAll(pointsForMasterChart, summaryChartId);
                   
                }, this.showError);
            },
            
            /**
             * Match Data Point Config to a list of data point summaries
             * @param pointConfig
             * @param pointSummaries
             * @returns {@G}
             */
            matchPointConfig: function(config, pointSummaries){
                var summary = null;
                $.each(pointSummaries, function(){
                    var pointSummary = this;
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
                        summary = pointSummary;
                        return false;
                    }
                    
                   
                });
                
                return summary;
            },
            
            /**
             * Get the Point configuration by matching
             * @param pointSummary - data points summary to match
             * @param pointConfigs - list of point configs to match against
             * @returns
             */
            matchPointSummary: function(pointSummary, pointConfigs){
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
            },
            /**
             * Create the statistics for the point
             * 
             * @param pointConfig
             */
            createStatistics: function(pointConfig, dataPointSummary){
                
                //Use Period or Dates
                var to, from;
                if(pointConfig.statistics.period != null){
                    to = new Date(); //Always to now
                    from = new Date(to.getTime() - pointConfig.statistics.period);
                }else{
                    from = this.fromDate;
                    to = this.toDate;
                }
                
                var _this = this;
                mangoRest.pointValues.getStatistics(dataPointSummary.xid, mangoRest.formatLocalDate(from), mangoRest.formatLocalDate(to), function(data){
                    if(data.hasData == true){
                        if(pointConfig.statistics.minimumId != null)
                            $("#" + pointConfig.statistics.minimumId).text(_this.displayPointValueTime(data.minimum));
                        if(pointConfig.statistics.maximumId != null)
                            $("#" + pointConfig.statistics.maximumId).text(_this.displayPointValueTime(data.maximum));
                        if(pointConfig.statistics.averageId != null)
                            $("#" + pointConfig.statistics.averageId).text(data.average.toFixed(_this.decimalPlaces));
                        if(pointConfig.statistics.integralId != null)
                            $("#" + pointConfig.statistics.integralId).text(data.integral.toFixed(_this.decimalPlaces));
                        if(pointConfig.statistics.sumId != null)
                            $("#" + pointConfig.statistics.sumId).text(data.sum.toFixed(_this.decimalPlaces));
                        if(pointConfig.statistics.firstId != null)
                            $("#" + pointConfig.statistics.firstId).text(_this.displayPointValueTime(data.first));
                        if(pointConfig.statistics.lastId != null)
                            $("#" + pointConfig.statistics.lastId).text(_this.displayPointValueTime(data.last));
                        if(pointConfig.statistics.countId != null)
                            $("#" + pointConfig.statistics.countId).text(data.count);
                    }else{
                        $("#errors").text("Statistics Error: " + data.message);
                    }
                    
                }, this.showError); 
                
            },
            /**
             * Create a chart for the point
             * @param dataPointSummary
             * @param pointConfig
             */
            createChart: function(pointConfig, dataPointSummary){
                
                if(pointConfig.chart.type == "line"){
                    this.createLineChart(pointConfig, dataPointSummary);
                }else if(pointConfig.chart.type == "gauge"){
                    this.createGaugeChart(pointConfig, dataPointSummary);
                }else if(pointConfig.chart.type == "text"){
                    this.createTextChart(pointConfig, dataPointSummary);
                }
            },
            /**
             * Helper to create a line chart from an XID
             * 
             */
            createLineChart: function (pointConfig, dataPointSummary){
                var _this = this;
                //Load in the Chart Configurations
                mangoRest.getJson("/modules/dashboards/web/private/charts/" + pointConfig.chart.config, function(data){
                    //Modify the data to suit the point
                    data.titles[0].text = pointConfig.chart.title;
                    //Override and add additional Value Axis Info
                    $.extend(true, data.valueAxes[0], data.valueAxes[0], pointConfig.chart.valueAxis);
                    //Add the chart to it
                    data.graphs[0] = 
                               {
                                   id: "AmGraph-" + dataPointSummary.xid,
                                   title: dataPointSummary.name,
                                   valueField: dataPointSummary.xid
                               };
                    
                    //Override and add any additional features
                    $.extend(true, data.graphs[0], data.graphs[0], pointConfig.chart.graph);
                    
                    var chartConfig = {
                            chartDivId: pointConfig.chart.divId,
                            xids: [dataPointSummary.xid],
                            chartJson: data,
                            showError: this.showError,
                        };

                    //Determine the date ranges
                    if(pointConfig.chart.pastPointCount != null){
                        chartConfig.numberOfSamples = pointConfig.chart.pastPointCount;
                    }else{
                        chartConfig.fromDate = _this.fromDate;
                        chartConfig.toDate = _this.toDate;
                    }
                    
                    //Setup Rollup
                    if(_this.rollupSelectId != null){
                        chartConfig.rollup = $('#'+_this.rollupSelectId).val();
                        chartConfig.timePeriodType = $('#'+_this.timePeriodTypeSelectId).val();
                        chartConfig.timePeriods = $('#'+_this.timePeriodInputId).val();
                    }
                    
                    
                    //Setup the value/time manipulation operations
                    if(typeof pointConfig.chart.dataOperation != 'undefined')
                        chartConfig.dataOperation = pointConfig.chart.dataOperation;
                    if(typeof pointConfig.chart.timeOperation != 'undefined')
                        chartConfig.timeOperation = pointConfig.chart.timeOperation;
                    
                    
                    var chart = new MangoAmChartHelper(chartConfig);
                    chart.createChart();

                    if(pointConfig.chart.realtime == true){
                        _this.realtimeChart(pointConfig, dataPointSummary, chart);
                    }
                    
                }, this.showError);
                
            },
            /**
             * 
             * @param pointConfig
             * @param chart
             */
            realtimeChart: function(pointConfig, dataPointSummary, chart){
                //Add the socket to the point config
                pointConfig.socket = mangoRest.pointValues.registerForEvents(dataPointSummary.xid,
                        ['UPDATE'],
                        function(message){ //On Message Received Method
                           if(message.status == 'OK'){
                               
                                chart.amChart.dataProvider.shift();
                                var data = {};
                                data[dataPointSummary.xid] = chart.dataOperation(chart.amChart.dataProvider, message.payload.value, dataPointSummary.xid);
                                data.date = chart.timeOperation(chart.amChart.dataProvider, message.payload.value, dataPointSummary.xid);
                                
                                
                                chart.amChart.dataProvider.push(data);
                                chart.amChart.validateData();
                                
                           }else{
                               document.getElementById('errors').innerHTML = message.payload.type + " - " + message.payload.message;
                           }
                        },function(error){ //On Error Method
                            document.getElementById('errors').innerHTML = "Chart Update Error: " + error;
                        },function(){ //On Open Method
                            //document.getElementById('errors').innerHTML = '';
                        },function(){ //On Close Method
                            //document.getElementById('errors').innerHTML = '';
                        });
                
            },
            /**
             * 
             * @param pointConfig
             */
            createGaugeChart: function(pointConfig, dataPointSummary){
                
                mangoRest.getJson("/modules/dashboards/web/private/charts/" + pointConfig.chart.config, function(data){
                    
                    var gaugeConfig = {
                        xid: dataPointSummary.xid,
                        gaugeDivId: pointConfig.chart.divId,
                        units: pointConfig.chart.units,
                        decimalPlaces: 2,
                        realtime: pointConfig.chart.realtime,
                        jsonConfig: data,
                        realtimeError: function(error){document.getElementById('errors').innerHTML = "Gauge Update Error: " + error;},
                        showError: this.showError,
                    };
                    
                    //Add in any custom rendering
                    if(typeof pointConfig.chart.renderValue != 'undefined')
                        gaugeConfig.renderValue =pointConfig.chart.renderValue;
                    
                    //Create a gauge for it
                    var gauge = new MangoAmGaugeHelper(gaugeConfig);
                    gauge.startGauge();
                }, this.showError);

            },
            /**
             * TODO Make this use the chart configs for each point
             * they will need to be passed in
             * @param dataPointSummaries
             * @param dashboard
             */
            createLineChartForAll: function(dataPointMap, summaryChartId){
            
                //Load in the Chart Configurations
                mangoRest.getJson("/modules/dashboards/web/private/charts/simpleLine.json", function(data){
                    //Modify the data to suit the point
                    data.titles[0].text = "All Points";
                    var xids = new Array();
                    for(var i=0; i<dataPointMap.length; i++){
                        var entry = dataPointMap[i];
                        xids.push(entry.dataPointSummary.xid);
                        //Add the chart to it
                        var graph = {
                                       id: "AmGraph-" + i,
                                       title: entry.dataPointSummary.name,
                                       valueField: entry.dataPointSummary.xid
                                   };
                        //Override and add any additional features
                        $.extend(true, graph, entry.config.chart.graph, graph);
                        data.graphs.push(graph);
                        
                    }
                    var chart = new MangoAmChartHelper({
                        chartDivId: summaryChartId,
                        xids: xids,
                        numberOfSamples: 200,
                        chartJson: data
                    });
                    chart.createChart();
                    
                    
                }, this.showError);
                
            },
            /**
             * Helper to create a text value rendered area
             * 
             */
            createTextChart: function (pointConfig, dataPointSummary){
 
                if(pointConfig.chart.realtime == true){
                    this.realtimeText(pointConfig, dataPointSummary);
                }else{
                    //Get the value now
                    mangoRest.pointValues.getLatest(dataPointSummary.xid, 1, function(data){
                        if(data.length > 0)
                            $("#" + pointConfig.chart.divId).text(pointConfig.chart.renderValue(data[0]));
                        else
                            $("#" + pointConfig.chart.divId).text("no data");
                    }, this.showError);
                    
                }
            },
            /**
             * 
             * @param pointConfig
             * @param chart
             */
            realtimeText: function(pointConfig, dataPointSummary){
                //Add the socket to the point config
                pointConfig.socket = mangoRest.pointValues.registerForEvents(dataPointSummary.xid,
                        ['UPDATE'],
                        function(message){ //On Message Received Method
                           if(message.status == 'OK'){
                              $("#" + pointConfig.chart.divId).text(pointConfig.chart.renderValue(message.payload.value));
                                
                           }else{
                               document.getElementById('errors').innerHTML = message.payload.type + " - " + message.payload.message;
                           }
                        },function(error){ //On Error Method
                            document.getElementById('errors').innerHTML = "Chart Update Error: " + error;
                        },function(){ //On Open Method
                            //document.getElementById('errors').innerHTML = '';
                        },function(){ //On Close Method
                            //document.getElementById('errors').innerHTML = '';
                        });
                
            },
            
            /**
             * Helper to display error messages in the error div
             * @param jqXHR - xhr response
             * @param textStatus - status from response
             * @param errorThrown - exception
             * @mangoMessaage - string response from Mango
             */
            showError: function(jqXHR, textStatus, errorThrown, mangoMessage){
            
                var msg = "";
                if(textStatus != null)
                    msg += (textStatus + " ");
                if(errorThrown != null)
                    msg += (errorThrown + " ");
                if(mangoMessage != null)
                    msg += (mangoMessage + " ");
                msg += "\n";
                $("#" + this.errorDivId).text(msg);
            }
};

