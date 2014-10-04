/**
 *Configuration of Rollups Picker into a <select>
 * 
 * One can use this class to tie point values into a drop down menu,via the html select property
 * This is done most the time byt tying in a Grouper to the SelectConfiguration. 
 
 * Example goes here.
 * 
 * {@property} divId {String} The div Id that one wants to use for the selctor
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

SelectConfiguration = function(divId, mixin, options){
    
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

SelectConfiguration.prototype = {
        
        
        divId: null, //Id of div to place Picker
        owner: null, //Owner Object to include in callback
        mixin: null, //Configuration overload
        configuration: null, //Full mixed-in config
        selected: 0, //Index selected
        
        addItem: function(label, id, selected){
            var html = "<option></option>";
//            if(selected == true)
//                html += "selected='selected'";
//            html += "></option>";
            $('#' + this.divId).append( $(html).text(label).val(id));
        },
        
        onChange: function(value, owner){
            console.log(value);
        },
        
        create: function(){
            var self = this;
            var select = $('#' + this.divId);
            //Add the options
            for(k in this.configuration.options){
                if(k == this.selected)
                    this.addItem(this.configuration.options[k].label, this.configuration.options[k].value, true);
                else
                    this.addItem(this.configuration.options[k].label, this.configuration.options[k].value, false);
                    
            }
            //Add the onChange method
            select.change(self.configuration.onChange);
            $('#' + this.divId).val(this.configuration.options[this.selected].value);
            $('#' + this.divId).selectmenu('refresh', true);
        },
        

        
        getBaseConfiguration: function(){
            return {
                options: [], //Array of {label, value}
            };
        }
        
};
