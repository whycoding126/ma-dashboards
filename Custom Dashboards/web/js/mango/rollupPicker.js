/**
 * Javascript Objects Used for Configuration of Rollups Picker
 * 
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

RollupConfiguration = function(divId, mixin, options){
    
    this.divId = divId;
    
    this.mixin = mixin;
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    //Setup The Configuration
    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.mixin);
    var self = this;
    this.configuration.onChange = function(){
        self.onChange($(this).val(), self.owner);
    };
};

RollupConfiguration.prototype = {
        
        
        divId: null, //Id of div to place Picker
        owner: null, //Owner Object to include in callback
        mixin: null, //Configuration overload
        configuration: null, //Full mixed-in config
        selected: 'AVERAGE',
        
        create: function(){
            var self = this;
            var select = $('#' + this.divId);
            //Add the options
            for(k in this.configuration.rollups){
                select.append( 
                        $("<option></option>").text(this.configuration.rollups[k]).val(this.configuration.rollups[k]));
            }
            $("#" +this.divId + " option[value='" + this.selected +"']").prop('selected', true);
            $('#' + this.divId).selectmenu('refresh', true);

            //Add the onChange method
            select.change(self.configuration.onChange);
        },
        
        onChange: function(value, owner){
            console.log(value);
        },
        
        getBaseConfiguration: function(){
            return {
                rollups: ['AVERAGE', 'MAXIMUM', 'MINIMUM', 'SUM', 'FIRST', 'LAST', 'COUNT'],
                onChange: function(rollup){
                    console.log(rollup);
                }
            };
        }
        
};
