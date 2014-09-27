/**
 * Javascript Objects Used for Configuration of Time Period Type Picker
 * 
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

TimePeriodTypeConfiguration = function(divId, mixin, options){
    
    this.divId = divId;
    
    this.mixin = mixin;
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.mixin);
    var self = this;
    this.configuration.onChange = function(){
        self.onChange($(this).val(), self.owner);
    };
};

TimePeriodTypeConfiguration.prototype = {
        
        
        divId: null, //Id of div to place Picker
        owner: null, //Owner Object to include in callback
        mixin: null, //Configuration overload
        configuration: null, //Full mixed-in config
        selected: 'HOURS',
        
        create: function(){
            var self = this;
            //Add the options
            var select = $('#' + this.divId);
            for(k in this.configuration.timePeriodTypes){
                var option = select.append( 
                        $("<option></option>")
                        .text(this.configuration.timePeriodTypes[k])
                        .val(this.configuration.timePeriodTypes[k]));
            }
            $("#" +this.divId + " option[value='" + this.selected +"']").prop('selected', true);

            //Add the onChange method
            select.change(self.configuration.onChange);
        },
        
        onChange: function(value, owner){
            console.log(value);
        },
        
        getBaseConfiguration: function(){
            return {
                timePeriodTypes: ['MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS'], //Not using yet 'MILLISECONDS', 'SECONDS',
                onChange: function(timePeriod){
                    console.log(timePeriod);
                }
            };
        }
        
};
