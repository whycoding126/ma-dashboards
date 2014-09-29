/**
 * Javascript Objects Used for Configuration of Rollups Picker
 * 
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

ListViewConfiguration = function(listId, mixin, options){
    
    this.listId = listId;
    
    this.mixin = mixin;
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    //Setup The Configuration
    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.mixin);
    var self = this;
//    this.configuration.onChange = function(){
//        self.onChange($(this).val(), self.owner);
//    };
};

ListViewConfiguration.prototype = {
        
        
        listId: null, //Id of List
        owner: null, //Owner Object to include in callback
        mixin: null, //Configuration overload
        configuration: null, //Full mixed-in config
        styleClass: null,
        
        addItem: function(label, id){
            var self = this;
//            $('#'+ this.listId).append(
//                    $('<li>').append(label));
            var li = $('<li>');
            $('#'+ this.listId).append(
                li.append(
                        $('<a>').attr('href','#').click(function(){self.onChange(id, self.owner);}).append(
                            $('<span>').append(label)             
                 )));   
            if(this.styleClass != null)
                li.attr('class', this.styleClass);
        },
        
        onChange: function(value, owner){
            console.log(value);
        },
        
        create: function(){
            var self = this;
            var list = $('#' + this.divId);
            //Add the options
            for(k in this.configuration.options){
                this.addItem(this.configuration.items[k].label, this.configuration.items[k].value);
            }
        },
        

        
        getBaseConfiguration: function(){
            return { 
                    items: [], //Array of {label, value}
                   };
            
        }
        
};
