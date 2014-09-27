/**
 * Javascript Objects Used for Configuration of Date Time Picker
 * 
 * Inputs:
 * - Rollup Drop Down
 * - Time Period Drop Down
 * - Periods Input
 * 
 * - Start Date Picker
 * - End Date Picker
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

DateTimePickerConfiguration = function(divId, mixin, options){
    this.divId = divId;
    this.mixin = mixin;
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.mixin);

    //Configure the callback
    var self = this;
    this.configuration.onChangeDateTime = function(dp, $input){
        self.onChange(dp, $input, self.owner);
    };
};


DateTimePickerConfiguration.prototype = {
        
        divId: null, //Id of div to place Picker
        owner: null, //Object to include in callback
        mixin: null, //Configuration overload
        configuration: null, //Full mixed-in config
        
        
        create: function(){
            
            jQuery("#" + this.divId).datetimepicker(this.configuration);
        },

        onChange: function(date, picker, owner){
            console.log('picked: ' + date);
        },
        
        getBaseConfiguration: function (){
                   return {
                        owner: null,
                        /**
                         * @param dp - Picked Date object
                         * @param $input - the input widget
                         */
                        onChangeDateTime: function(dp,$input){
                            console.log(dp); //Log the date
                        },
                        format: 'd/m/Y H:i:s',
                        closeOnDateSelect: false, //Close when date is selected
                    };
  
        },
};