(function(global, factory) {
    if (typeof define === "function" && define.amd) define(factory);
    else if (typeof module === "object") module.exports = factory();
    else global.extend = factory();
}(this, function() {
    "use strict";
    
    // use Object.create if available, otherwise use shim
    var create = Object.create ? Object.create : function(proto) {
        function Type() {}
        Type.prototype = proto;
        return new Type();
    };
    
    var extend = function(parent, properties) {
        // setup new prototype and set base property on it
        var prototype = create(parent.prototype);
        prototype.base = parent.prototype;
        
        var extended;
        if (typeof properties.init === 'function') {
            // use provided init function
            extended = properties.init;
        } else if (parent === Object) {
            // don't call Object constructor as it returns an object with an empty prototype
            extended = function() {};
        } else {
            // use parent constructor
            extended = function() {
                this.base = parent.prototype.base;
                var result = parent.apply(this, arguments);
                delete this.base;
                return result;
            };
        }
        
        // copy supplied properties into the prototype
        for (var key in properties) {
            prototype[key] = properties[key];
        }
        
        // make sure prototype.init always refers to the super constructor
        prototype.init = extended;
        
        // set the prototype on the new extended type
        extended.prototype = prototype;
        
        // give the new type an extend method
        extended.extend = function(properties) {
            return extend(this, properties);
        };

        return extended;
    };
    
    return extend;
}));