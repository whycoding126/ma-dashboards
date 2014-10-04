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
        selected: 0, //Item selected
        
        addItem: function(label, id){
            $('#' + this.divId).append( $("<option></option>").text(label).val(id));
        },
        
        onChange: function(value, owner){
            console.log(value);
        },
        
        create: function(){
            var self = this;
            var select = $('#' + this.divId);
            //Add the options
            for(k in this.configuration.options){
                this.addItem(this.configuration.options[k].label, this.configuration.options[k].value);
            }
            $("#" +this.divId + " option[value='" + this.selected +"']").prop('selected', true);

            //Add the onChange method
            select.change(self.configuration.onChange);
        },
        

        
        getBaseConfiguration: function(){
            return {
                options: [], //Array of {label, value}
            };
        }
        
};
