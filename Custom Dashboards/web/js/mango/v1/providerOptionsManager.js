define(['jquery', 'extend', 'moment-timezone'],
function($, extend, moment) {

var ProviderOptionsManager = extend(Object, {
    providerOptions: null,
    providers: [],
    refreshOnChange: true,
    //periodsLimit: 62, // i.e. maximum of 2 months by day, 2.58 days by hour
    
    timePicker: null,
    rollupPicker: null,
    timePeriodTypePicker: null,
    timePeriodsPicker: null,
    
    init: function(options) {
        this.pickerChanged = this.pickerChanged.bind(this);
        
        this.providerOptions = {
            from: 0,
            to: 0,
            rollup: 'AVERAGE',
            timePeriodType: 'HOURS',
            timePeriods: 1
        };
        this.providers = [];
        
        $.extend(this, options);
        
        this.setTimePicker(this.timePicker);
        this.setRollupPicker(this.rollupPicker);
        this.setTimePeriodTypePicker(this.timePeriodTypePicker);
        this.setTimePeriodsPicker(this.timePeriodsPicker);
    },
    
    errorFunction: function() {},
    
    refreshProviders: function(forceRefresh) {
        var self = this;
        $.each(this.providers, function(key, provider) {
            self.refreshProvider(provider, forceRefresh);
        });
    },
    
    refreshProvider: function(provider, forceRefresh) {
        if (provider && provider.enabled) {
            // clone the options so providers can't modify them
            var options = $.extend({}, this.providerOptions);
            options.forceRefresh = forceRefresh || false;
            
            provider.load(options).fail(this.errorFunction);
        }
    },

    clearDisplays: function() {
        $.each(this.providers, function(key, provider) {
            provider.clear();
        });
    },
    
    addProvider: function(provider) {
        if (!provider)
            return;
        if ($.inArray(provider, this.providers) < 0)
            this.providers.push(provider);
    },
    
    /**
     * Finds an existing provider which matches an array of DataPointConfigurations
     * 
     * @param dataPointConfigurations - array of DataPointConfiguration
     * @returns a provider
     */
    findProvider: function(providerType, pointConfigs) {
        if (!$.isArray(pointConfigs))
            pointConfigs = [pointConfigs];
        
        for (var i = 0; i < this.providers.length; i++) {
            var provider = this.providers[i];
            if (provider.type !== providerType)
                continue;
            if (this.comparePointConfigs(pointConfigs, provider.pointConfigurations)) {
                return provider;
            }
        }
    },
    
    /**
     * Compares two DataPointConfiguration arrays based solely on point xid
     * 
     * @param array1
     * @param array2
     * @returns true if equivalent
     */
    comparePointConfigs: function(array1, array2) {
        if (array1.length !== array2.length)
            return false;
        
        for (var i = 0; i < array1.length; i++) {
            var config1 = array1[i];
            var foundConfig1 = false;
            for (var j = 0; j < array2.length; j++) {
                var config2 = array2[j];
                if (config1.point.xid == config2.point.xid) {
                    foundConfig1 = true;
                    break;
                }
            }
            if (!foundConfig1)
                return false;
        }
        return true;
    },
    
    pickerChanged: function(event, data) {
        var triggerRefresh = true;
        
        if (event.target === this.timePicker) {
            if (!data.triggerRefresh)
                triggerRefresh = false;
            this.timePickerChanged(data.preset);
        }
        this.loadFromPickers();
        
        if (this.refreshOnChange && triggerRefresh) {
            this.refreshProviders();
        }

        $(this).trigger("change", this.providerOptions);
    },

    timePickerChanged: function(preset) {
        switch(preset) {
        case 'PREVIOUS_DAY':
        case 'YESTERDAY':
        case 'DAY_TO_DATE':
            this.providerOptions.timePeriodType = 'HOURS';
            this.providerOptions.timePeriods = 1;
            setPickers = true;
            break;
        case 'PREVIOUS_WEEK':
        case 'LAST_WEEK':
        case 'WEEK_TO_DATE':
            this.providerOptions.timePeriodType = 'DAYS';
            this.providerOptions.timePeriods = 1;
            break;
        case 'PREVIOUS_4WEEKS':
        case 'PREVIOUS_MONTH':
        case 'LAST_MONTH':
        case 'MONTH_TO_DATE':
            this.providerOptions.timePeriodType = 'DAYS';
            this.providerOptions.timePeriods = 1;
            break;
        case 'PREVIOUS_YEAR':
        case 'LAST_YEAR':
        case 'YEAR_TO_DATE':
            this.providerOptions.timePeriodType = 'MONTHS';
            this.providerOptions.timePeriods = 1;
            break;
        default:
            // dont change anything for custom time periods
            return;
        }
        
        if (this.timePeriodsPicker)
            this.timePeriodsPicker.val(this.providerOptions.timePeriods);
        if (this.timePeriodTypePicker)
            this.timePeriodTypePicker.val(this.providerOptions.timePeriodType);
    },
    
    quantizationPeriod: function() {
        return moment.duration(this.providerOptions.timePeriods,
                this.providerOptions.timePeriodType.toLowerCase());
    },
    
    loadFromPickers: function(event) {
        if (this.timePicker) {
            var from = this.timePicker.from;
            var to = this.timePicker.to;
            
            if (to.isBefore(from))
                return;
            
            this.providerOptions.from = from.toDate();
            this.providerOptions.to = to.toDate();
            this.providerOptions.fromMoment = from;
            this.providerOptions.toMoment = to;
        }
        
        if (this.rollupPicker && this.rollupPicker.length > 0) {
            this.providerOptions.rollup = this.rollupPicker.val();
        }
        if (this.timePeriodTypePicker && this.timePeriodTypePicker.length > 0) {
            this.providerOptions.timePeriodType = this.timePeriodTypePicker.val();
        }
        if (this.timePeriodsPicker && this.timePeriodsPicker.length > 0) {
            this.providerOptions.timePeriods = parseInt(this.timePeriodsPicker.val(), 10);
        }
        
        /*
        if (this.periodsLimit) {
            var quantizationPeriod = moment.duration(this.providerOptions.timePeriods,
                    this.providerOptions.timePeriodType.toLowerCase());
            var timePeriod = this.providerOptions.to - this.providerOptions.from;
            var periods = timePeriod / quantizationPeriod.asMilliseconds();
            
            if (periods > this.periodsLimit) {
                var minDuration = moment.duration(timePeriod / this.periodsLimit);
                if (minDuration.asHours() < 24) {
                    this.providerOptions.timePeriods = Math.ceil(minDuration.asHours());
                    this.providerOptions.timePeriodType = 'HOURS';
                } else if (minDuration.asDays() < 30) {
                    this.providerOptions.timePeriods = Math.ceil(minDuration.asDays());
                    this.providerOptions.timePeriodType = 'DAYS';
                } else {
                    this.providerOptions.timePeriods = Math.ceil(minDuration.asMonths());
                    this.providerOptions.timePeriodType = 'MONTHS';
                }
                if (this.timePeriodsPicker)
                    this.timePeriodsPicker.val(this.providerOptions.timePeriods);
                if (this.timePeriodTypePicker)
                    this.timePeriodTypePicker.val(this.providerOptions.timePeriodType);
            }
        }
        */
        
        var timePeriod = this.providerOptions.to - this.providerOptions.from;
        if (timePeriod >  moment.duration(3, 'months').asMilliseconds()) {
            this.providerOptions.timePeriods = 1;
            this.providerOptions.timePeriodType = 'MONTHS';
        }
        else if (timePeriod >  moment.duration(1, 'weeks').asMilliseconds() &&
                this.providerOptions.timePeriodType === 'HOURS') {
            this.providerOptions.timePeriods = 1;
            this.providerOptions.timePeriodType = 'DAYS';
        }
        
        if (this.timePeriodsPicker)
            this.timePeriodsPicker.val(this.providerOptions.timePeriods);
        if (this.timePeriodTypePicker)
            this.timePeriodTypePicker.val(this.providerOptions.timePeriodType);
    },
    
    setTimePicker: function(picker) {
        this.setPicker('timePicker', picker);
    },
    
    setRollupPicker: function(picker) {
        this.setPicker('rollupPicker', picker);
    },
    
    setTimePeriodTypePicker: function(picker) {
        this.setPicker('timePeriodTypePicker', picker);
    },
    
    setTimePeriodsPicker: function(picker) {
        this.setPicker('timePeriodsPicker', picker);
    },
    
    setPicker: function(pickerName, picker) {
        var existingPicker = this[pickerName];
        if (existingPicker) {
            existingPicker.off('change', this.pickerChanged);
        }
        if (picker) {
            $(picker).on('change', this.pickerChanged);
            this[pickerName] = picker;
        }
    }
});

return ProviderOptionsManager;

}); // require
