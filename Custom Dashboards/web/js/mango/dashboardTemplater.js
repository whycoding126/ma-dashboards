/**
*
* This is the Templeater aka the thing that ties the all the other imporant modlues togeather. 
* a Simple DashboardTemplater Would look something like this
*
* Copyright (C) 2014 Infinite Automation Software. All rights reserved.
* Terry Packer (implamentation)
* Joseph Mills (documention)
*
*
     * Simple Example
     *
     *     @example
     *     var templaterConfig = {
     *         debug: true,
     *         type: 'PointHierarchy',
     *         displayConfigurations: displayConfigurations,
     *         pointConfigurations: pointConfigurations,
     *         groupConfigurations: groupConfigurations,
     *         dataProviders: dataProviders,
     *         groupSelectConfiguration: groupListView,
     *     }
     *     templater = new DashboardTemplater(templaterConfig);
     *
*
* Lets say that we want to take in custom objects on are query to the Mango backend. 
* If one would want to do such a thing they can. Here  is a example of using Custom Input to a Templater, 
* for setting the time to be one month from 24 hours ago see line's
*
     * Custom Templater
     *
     *     @example
     *     var to = new Date();
     *     var from = new Date(to.getTime() - 1000*60*60*24*30);
     *     var templaterCustomConfig = {
     *     debug: true,
     *     displayConfigurations: displayConfigurations,
     *     pointConfigurations: pointConfigurations,
     *     groupConfigurations: groupConfigurations,
     *     dataProviders: dataProviders,
     *     groupSelectConfiguration: groupListView,
     *     //grouper
     *     startDate: from, //adding the custom option of startDate and adding the varible that we defined above. 
     *     endDate: to, // adding the too varible to the custom options
     *     rollup: 'AVERAGE',
     *     timePeriods: 1,
     *     }
     *     var templaterCustom  = new DashboardTemplater(templaterCustomConfig);
     *
*
* Adding more then One Templeater
*
* TODO after terry fixes this I will document this.  
*
*
*
*@param {Boolean} debug Make sure that the templeate for the Widget is in debug mode.  This is handy when wondering why a widget is not working
*
*@param {String} type DOCME
*
*@param {String} dataDisplayManager This is the connecting peice to you Display Manger. If you would like to read more about the display manager please vist <a
* src="#">This Help Page</a>
*
*@param {String} pointConfigurations This is the main point Configuration That one would assign 
* tpo many points or just single points in the mango 
* system
* If you would like to read more about the pointConfigurations please vist <a src="#">This Help Page</a>
*
*@param {String} groupConfigurations This is the main grouper that one is using to group points to the 
* display system and pass them off to the Matcher
* If you would like to read more about the Groups and there configuration  please vist {@link Man#groupConfigurations This Help Page}
*
*@param {String} groupSelectConfiguration this is the main ui piece that one is going to use with the grouped data. 
*
*
* Optional Custom Inputs:
*  
*@param {String} Rollup Drop Down
*@param {String} Time Period Drop Down
*@param {String} Periods Input
* 
*@param {Date} startDatePicker
*@param {Date} endDatePicker
* 
*
*/

DashboardTemplater = function(options){
    
    for(var i in options) {
        this[i] = options[i];
    }    
    
    //Ensure we have arrays for all important items
    if(this.displayConfigurations == null)
        this.displayConfigurations = new Array();
    if(this.pointConfigurations == null)
        this.pointConfigurations = new Array();
    if(this.groupConfigurations == null)
        this.groupConfigurations = new Array();
    if(this.groups == null)
        this.groups = new Array();
    
    if(this.endDate == null)
        this.endDate = new Date();
    if(this.startDate == null)
        this.startDate = new Date(this.endDate.getTime() - 1000*60*60*12); //12Hr
    if(this.rollup == null)
        this.rollup = 'AVERAGE';
    if(this.timePeriodType == null)
        this.timePeriodType = 'HOURS';
    if(this.timePeriods == null)
        this.timePeriods = 1;
    if(this.historicalSamples == null)
        this.historicalSamples = 10; //Default to 10 Historical Samples
    
    var self = this; //Save a reference for our actions
    
    //Setup the Inputs
    if(this.startDateConfiguration == null)
        this.startDateConfiguration = new DateTimePickerConfiguration('startDate', {}, {defaultValue: self.startDate, owner: self, onChange: self.startDateChanged});
    else{
        if(this.startDateConfiguration.owner == null)
            this.startDateConfiguration.owner = self;
        if(this.startDateConfiguration.onChange == null)
            this.startDateConfiguration.onChange = self.startDateChanged;
    } 
    this.startDateConfiguration.create();
    
    //Create End Date
    if(this.endDateConfiguration == null)
        this.endDateConfiguration = new DateTimePickerConfiguration('endDate', {}, {defaultValue: self.endDate, owner: self, onChange: self.endDateChanged});
    else{
        if(this.endDateConfiguration.owner == null)
            this.endDateConfiguration.owner = self;
        if(this.endDateConfiguration.onChange == null)
            this.endDateConfiguration.onChange = self.endDateChanged;
    } 
    this.endDateConfiguration.create();
    
    if(this.rollupConfiguration == null)
        this.rollupConfiguration = new RollupConfiguration('rollup', {}, {owner: self, onChange: self.rollupChanged, selected: this.rollup});
    else{
        if(this.rollupConfiguration.owner == null)
            this.rollupConfiguration.owner = self;
        if(this.rollupConfiguration.onChange == null)
            this.rollupConfiguration.onChange = self.rollupChanged;
    }    
    this.rollupConfiguration.create();
    
    if(this.timePeriodTypeConfiguration == null)
        this.timePeriodTypeConfiguration = new TimePeriodTypeConfiguration('timePeriodType', {}, {owner: self, onChange: self.timePeriodTypeChanged, selected: this.timePeriodType});
    else{
        if(this.timePeriodTypeConfiguration.owner == null)
            this.timePeriodTypeConfiguration.owner = self;
        if(this.timePeriodTypeConfiguration.onChange == null)
            this.timePeriodTypeConfiguration.onChange = self.timePeriodTypeChanged;
    }
    this.timePeriodTypeConfiguration.create();
  
    if(this.timePeriodConfiguration == null)
        this.timePeriodConfiguration = new InputConfiguration('timePeriod', {}, {owner: self, onChange: self.timePeriodChanged, defaultValue: this.timePeriods});
    else{
        if(this.timePeriodConfiguration.owner == null)
            this.timePeriodConfiguration.owner = self;
        if(this.timePeriodConfiguration.onChange == null)
            this.timePeriodConfiguration.onChange = self.timePeriodChanged;
    }
    this.timePeriodConfiguration.create();
    
    if(this.groupSelectConfiguration == null)
        this.groupSelectConfiguration = new SelectConfiguration('groups',{}, {owner: self, onChange: self.groupChanged, defaultValue: 0});
    else{
        if(this.groupSelectConfiguration.owner == null)
            this.groupSelectConfiguration.owner = self;
        if(this.groupSelectConfiguration.groupChanged == null)
            this.groupSelectConfiguration.onChange = self.groupChanged;
    }
    this.groupSelectConfiguration.create();
    
    //Display Manager
    if(this.displayManager == null)
        this.displayManager = new DataDisplayManager(this.displayConfigurations);
    if(this.dataProviders != null){
        for(var i=0; i<this.dataProviders.length; i++){
            this.displayManager.addProvider(this.dataProviders[i]);
        }
    }
    
    
    //Point Matcher
    if(this.pointMatcher == null)
        this.pointMatcher = new DataPointMatcher(this.pointConfigurations, this.onMatch, {owner: self});
    
    //Grouper
    if(this.groupMatcher == null){
        if(this.type == 'PointHierarchy'){
          //Fetch the Point Hierarchy to work with        
            this.deferred = mangoRest.hierarchy.getRoot(function(phRoot){

                root = phRoot; //Set the Global
               
            },this.showError); //end get data points
           
            $.when(this.deferred).then(function(){
                self.groupMatcher = new PointHierarchyGrouper(root, self.groupConfigurations, self.onGroup, {owner: self});
                self.groupMatcher.group(); //Do your job grouper
                if(self.loadGroupAtStartup != null) //Load a Group if required
                    self.groupChanged(self.loadGroupAtStartup,self);
            });
        }
    }
    
};


DashboardTemplater.prototype = {
        
        debug: false,
        
        type: 'PointHierarchy', //Currently only available Option
        
        deferred: null, //Deferred to know when Templater is Ready after creation
        
        loadGroupAtStartup: null, //Group Index to load at startup, can be null
        
        rollupConfiguration: null,
        timePeriodTypeConfiguration: null,
        timePeriodConfiguration: null,
        
        historicalSamples: null, //Default Number of historical samples to use for historical providers
        
        startDateConfiguration: null,
        endDateConfiguration: null,
        
        displayManager: null, 
        displayConfigurations: null,
        
        dataProviders: null, //List of pre-created providers
        
        pointMatcher: null,
        pointConfigurations: null,
        
        groupMatcher: null,
        groupConfigurations: null,
        groupSelectConfiguration: null,
        groups: null, //List of matched groups for drop down
        groupId: null, //Current Group ID
        
        startDate: null,
        endDate: null,
        rollup: null,
        timePeriodType: null,
        timePeriods: null,
        
        startDateChanged: function(date, $input, templater){
            if(templater.debug)
                console.log('SD: ' + date);
            templater.startDate = date;
            templater.displayManager.clear(false); //Clear all data  AND Point Configurations on a change of Group
            templater.refresh(null, templater);
        },
        endDateChanged: function(date, $input, templater){
            if(templater.debug)
                console.log('ED: ' + date);
            templater.endDate = date;
            templater.displayManager.clear(false); //Clear all data  AND Point Configurations on a change of Group
            templater.refresh(null, templater);
        },
        rollupChanged: function(rollup, templater){
            if(templater.debug)
                console.log('RU: ' + rollup);
            templater.rollup = rollup;
            templater.displayManager.clear(false); //Clear all data  AND Point Configurations on a change of Group
            templater.refresh(null, templater);
        },
        timePeriodTypeChanged: function(timePeriodType, templater){
            if(templater.debug)
                console.log('TPT: ' + timePeriodType);
            templater.timePeriodType = timePeriodType;
            templater.displayManager.clear(false); //Clear all data  AND Point Configurations on a change of Group
            templater.refresh(null, templater);
        },
        timePeriodChanged: function(timePeriods, templater){
            if(templater.debug)
                console.log('TP: ' + timePeriods);
            templater.timePeriods = timePeriods;
            templater.displayManager.clear(false); //Clear all data  AND Point Configurations on a change of Group
            templater.refresh(null, templater);
        },
        onMatch: function(dataPointConfiguration, templater){
            if(templater.debug)
                console.log('MatchedPoint: {name: ' + dataPointConfiguration.point.name + ", providerId: " + dataPointConfiguration.providerId + ", providerType: " + dataPointConfiguration.providerType);
            templater.displayManager.addDataPointConfiguration(dataPointConfiguration);
        },
        onGroup: function(dataPointGroup, templater){
            if(templater.debug)
                console.log('MatchedGroup: ' + dataPointGroup.label + "(" + dataPointGroup.dataPoints.length + ")");
            templater.groupSelectConfiguration.addItem(dataPointGroup.label, templater.groups.length);
            templater.groups.push(dataPointGroup);
        },
        groupChanged: function(groupId, templater){
            if(templater.debug)
                console.log('GroupChanged: ' + groupId);
            templater.groupId =  groupId;
            templater.displayManager.clear(true); //Clear all data  AND Point Configurations on a change of Group
            var matchedConfigs = templater.pointMatcher.match(templater.groups[groupId].dataPoints);
            templater.refresh(null, templater);
        },
        /**
         * Refresh the providers using the dates/rollups already set in templater
         * @param providerIds
         * @param templater
         */
        refresh: function(providerIds, templater){
            templater.displayManager.refresh(providerIds, 
                    {
                        from: templater.startDate, 
                        to: templater.endDate, 
                        rollup: templater.rollup, 
                        timePeriodType: templater.timePeriodType, 
                        timePeriods: templater.timePeriods,
                        historicalSamples: templater.historicalSamples
                });
        },
        
        /**
         * Have one or many data providers put a value to Mango
         * @param ids - Array of integer Ids of data providers
         * @param options - { 
         *                    value: PointValueTimeModel {value: object, time: long},
         *                    refresh: boolean to indicate a refresh of displays with this data
         *                  }
         */
        put: function(ids, options){
            if((typeof ids == 'undefined')||(ids == null)){
                for(var i=0; i<this.dataProviders.length; i++){
                    this.dataProviders[i].put(options, this.showError);
                }
            }else{
                //We have Args
                for(var i=0; i<this.dataProviders.length; i++){
                    if($.inArray(this.dataProviders[i].id, ids) >= 0){
                        this.dataProviders[i].put(options, this.showError);
                    }
                }
            }
        },
        
        invalidateChartSize: function(chartDivIds, templater){
            for(var i=0; i<templater.displayManager.displays.length; i++){
                var display = templater.displayManager.displays[i];
                if($.inArray(display.divId, chartDivIds) >= 0){
                   //Invlidate the chart size
                   display.amChart.invalidateSize();
               }
            }
        },
        
        /**
         * Display Errors method
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
            $("#errors").text(msg);
        }
        
};
