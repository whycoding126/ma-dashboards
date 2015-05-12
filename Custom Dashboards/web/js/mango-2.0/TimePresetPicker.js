/**
 * Inputs for To/From Dates and various Preset intervals
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 * @module {TimePresetPicker} mango/TimePresetPicker
 * @see TimePresetPicker
 * @tutorial dataPointChart
 */
define(['jquery', 'moment-timezone', 'mango/TimePresetStore', 'mango/TimePeriodTypeStore', 'mango/RollupStore', 'dstore/legacy/DstoreAdapter', 'dstore/Memory', 'jquery-ui/jquery.datetimepicker'], 
		function($, moment, TimePresetStore, TimePeriodTypeStore, RollupStore, DstoreAdapter, Memory) {

/*
 * The time period options and values are taken from the Java class
 * com.serotonin.m2m2.TimePeriodDescriptor. Ensure that they match. 
 */

/**
 * @constructs TimePresetPicker
 * @param {Object} options - options for picker
 */
TimePresetPicker = function(options) {
    this.presetPickerChanged = this.presetPickerChanged.bind(this);
    this.fromToPickerChanged = this.fromToPickerChanged.bind(this);
    this.rollupPickerChanged = this.rollupPickerChanged.bind(this);
    this.timePeriodTypePickerChanged = this.timePeriodTypePickerChanged.bind(this);
    this.timePeriodInputChanged = this.timePeriodInputChanged.bind(this);
    
    
    $.extend(this, options);
    
    this.setPresetPicker(this.presetPicker);
    this.setFromPicker(this.fromPicker);
    this.setToPicker(this.toPicker);
    this.setRollupPicker(this.rollupPicker);
    this.setTimePeriodTypePicker(this.timePeriodTypePicker);
    this.setTimePeriodInput(this.timePeriodInput);
    
    this.setDefaultPreset(false);
};


/**
 * Preset Date Range Picker
 * @type {?Object}
 * @default null
 */
TimePresetPicker.prototype.presetPicker = null;
/**
 * @type {?Object}
 * @default null
 */
TimePresetPicker.prototype.fromPicker = null;
/**
 * @type {?Object}
 * @default null
 */
TimePresetPicker.prototype.toPicker = null;
/**
 * @type {?Object}
 * @default null
 */
TimePresetPicker.prototype.rollupPicker = null;
/**
 * @type {boolean}
 * @default true
 */
TimePresetPicker.prototype.rollupPickerTriggersRefresh = true;

/**
 * @type {?Object}
 * @default null
 */
TimePresetPicker.prototype.timePeriodTypePicker = null;
/**
 * @type {boolean}
 * @default true
 */
TimePresetPicker.prototype.timePeriodTypePickerTriggersRefresh = true;
/**
 * Input for time periods
 * @type {?Object}
 * @default null
 */
TimePresetPicker.prototype.timePeriodsInput = null;
/**
 * @type {boolean}
 * @default true
 */
TimePresetPicker.prototype.timePeriodsInputTriggersRefresh = true;
/**
 * Current preset
 * @type {string}
 * @default null
 */
TimePresetPicker.prototype.preset = null;
/**
 * Current from date
 * @type {date}
 * @default null
 */
TimePresetPicker.prototype.from = null;
/**
 * Current to date
 * @type {date}
 * @default null
 */
TimePresetPicker.prototype.to = null;
/**
 * Current preset
 * @type {string}
 * @default null
 */
TimePresetPicker.prototype.rollup = null;
/**
 * Current time period type
 * @type {string}
 * @default null
 */
TimePresetPicker.prototype.timePeriodType = null;
/**
 * Current timePeriods
 * @type {number}
 * @default null
 */
TimePresetPicker.prototype.timePeriods = null;


/**
 * Format
 * @type {string}
 */
TimePresetPicker.prototype.format = 'lll';
/**
 * Time Format
 * @type {string}
 */
TimePresetPicker.prototype.formatTime = 'LT';
/**
 * Date Format
 * @type {string}
 */
TimePresetPicker.prototype.formatDate = 'l';
/**
 * Default Period
 * @type {string}
 */
TimePresetPicker.prototype.defaultPeriod = 'PREVIOUS_DAY';

/**
 * Set Preset picker
 * @param {Object} picker
 */
TimePresetPicker.prototype.setPresetPicker = function(picker) {
    if (this.presetPicker) {
        this.presetPicker.off('change', this.presetPickerChanged);
    }
    if (picker) {
        picker.on('change', this.presetPickerChanged);
        this.presetPicker = picker;
        if(this.presetPicker.store.data.length === 0)
			this.presetPicker.set('store',new DstoreAdapter(new TimePresetStore())); 
        this.preset = this.presetPicker.get('value');
    }
};


/**
 * Set Rollup picker
 * @param {Object} picker
 */
TimePresetPicker.prototype.setRollupPicker = function(picker) {
    if (this.rollupPicker) {
        this.rollupPicker.off('change', this.rollupPickerChanged);
    }
    if (picker) {
        picker.on('change', this.rollupPickerChanged);
        this.rollupPicker = picker;
        if(this.rollupPicker.store.data.length === 0)
			this.rollupPicker.set('store',new DstoreAdapter(new RollupStore())); 
        this.rollup = this.rollupPicker.get('value');
    }
};

/**
 * Set TimePeriodType picker
 * @param {Object} picker
 */
TimePresetPicker.prototype.setTimePeriodTypePicker = function(picker) {
    if (this.timePeriodTypePicker) {
        this.timePeriodTypePicker.off('change', this.timePeriodTypePickerChanged);
    }
    if (picker) {
        picker.on('change', this.timePeriodTypePickerChanged);
        this.timePeriodTypePicker = picker;
        if(this.timePeriodTypePicker.store.data.length === 0)
			this.timePeriodTypePicker.set('store',new DstoreAdapter(new TimePeriodTypeStore())); 
        this.timePeriodType = this.timePeriodTypePicker.get('value');
    }
};

/**
 * Set TimePeriodType picker
 * @param {Object} picker
 */
TimePresetPicker.prototype.setTimePeriodInput = function(input) {
    if (this.timePeriodInput) {
        this.timePeriodInput.off('change', this.timePeriodInputChanged);
    }
    if (input) {
        input.on('change', this.timePeriodInputChanged);
        this.timePeriodInput = input;
        this.timePeriods = this.timePeriodInput.val();
    }
};

/**
 * Helper to Set to/from picker
 * @param {Object} picker
 * @param {string} pickerName
 */
TimePresetPicker.prototype.setToFromPicker = function(pickerName, picker) {
    if (this[pickerName]) {
        this[pickerName].off('change', this.fromToPickerChanged);
    }
    if (picker) {
        picker.datetimepicker({
            format: this.format,
            formatTime: this.formatTime,
            formatDate: this.formatDate
        });
        picker.on('change', this.fromToPickerChanged);
        this[pickerName] = picker;
    }
};

/**
 * Set from picker
 * @param {Object} picker
 */
TimePresetPicker.prototype.setFromPicker = function(picker) {
    this.setToFromPicker('fromPicker', picker);
};

/**
 * Set to picker
 * @param {Object} picker
 */
TimePresetPicker.prototype.setToPicker = function(picker) {
    this.setToFromPicker('toPicker', picker);
};

/**
 * Get from date
 * @returns {date}
 */
TimePresetPicker.prototype.fromDate = function() {
    return this.from.toDate();
};

/**
 * Get to date
 * @returns {date}
 */
TimePresetPicker.prototype.toDate = function() {
    return this.to.toDate();
};

/**
 * Get current preset
 * @return {string}
 */
TimePresetPicker.prototype.currentPreset = function() {
    return this.preset;
};

/**
 * Hourly difference in dates
 * @returns {boolean}
 */
TimePresetPicker.prototype.hours = function() {
    return this.to.diff(this.from, 'hours', true);
};

/**
 * Populate Preset Picker
 */
TimePresetPicker.prototype.populatePresetPicker = function() {
	this.populatePicker(this.presetPicker, this.presets);
};

/**
 * Populate Rollup Picker
 */
TimePresetPicker.prototype.populateRollupPicker = function() {
	this.populatePicker(this.rollupPicker, this.rollups);
};

/**
 * Populate Time Period Type Picker
 */
TimePresetPicker.prototype.populateTimePeriodTypePicker = function() {
	this.populatePicker(this.timePeriodTypePicker, this.timePeriodTypes);
};

/**
 * Populate the picker
 * @param {Object} picker - select node
 * @param {Object} presets - presets for picker
 */
TimePresetPicker.prototype.populatePicker = function(picker, presets){
    for (var preset in presets) {
        var option = $('<option>');
        option.attr('value', preset);
        option.text(presets[preset].description);
        picker.append(option);
    }
}

/**
 * From/To Picker has changed
 */
TimePresetPicker.prototype.fromToPickerChanged = function(event) {
    var zone = moment.defaultZone && moment.defaultZone.name;
    var from = zone ? moment.tz(this.fromPicker.val(), this.format, zone) :
        moment(this.fromPicker.val(), this.format);
    var to = zone ? moment.tz(this.toPicker.val(), this.format, zone) :
        moment(this.toPicker.val(), this.format);
    
    if (from.isValid())
        this.from = from;
    if (to.isValid())
        this.to = to;
    
    this.setPreset('FIXED_TO_FIXED');
};

/**
 * Preset Picker Changed
 * @param event
 */
TimePresetPicker.prototype.presetPickerChanged = function(event) {
    var preset = this.presetPicker.get('value');
    this.setPreset(preset);
};

/**
 * Rollup Picker Changed
 * @param event
 */
TimePresetPicker.prototype.rollupPickerChanged = function(event) {
    this.rollup = this.rollupPicker.get('value');
    this.triggerChange(this.rollupPickerTriggersRefresh);
};

/**
 * TimePeriodType Picker Changed
 * @param event
 */
TimePresetPicker.prototype.timePeriodTypePickerChanged = function(event) {
    this.timePeriodType = this.timePeriodTypePicker.get('value');
    this.triggerChange(this.timePeriodTypePickerTriggersRefresh);
};

/**
 * TimePeriod Input Changed
 * @param event
 */
TimePresetPicker.prototype.timePeriodInputChanged = function(event) {
    this.timePeriods = this.timePeriodInput.val();
    this.triggerChange(this.timePeriodInputTriggersRefresh);
};

/**
 * Set the default preset
 * @param {boolean} triggerRefresh
 */
TimePresetPicker.prototype.setDefaultPreset = function(triggerEvent) {
    if (typeof triggerEvent === 'undefined')
        triggerEvent = true;
    this.setPreset(this.defaultPeriod, triggerEvent);
};

/**
 * Set preset value
 * @param {string} preset
 * @param {boolean} triggerRefresh 
 */
TimePresetPicker.prototype.setPreset = function(preset, triggerRefresh) {
    if (typeof triggerRefresh === 'undefined')
        triggerRefresh = true;
    
    this.preset = preset;
    if (this.presetPicker) {
        this.presetPicker.set('value',preset);
    }
    
    var period = TimePresetPicker.calculatePeriod(preset);
    if (period.from) {
        this.from = period.from;
        if (this.fromPicker) {
            this.fromPicker.val(period.from.format(this.format));
        }
    }
    if (period.to) {
        this.to = period.to;
        if (this.toPicker) {
            this.toPicker.val(period.to.format(this.format));
        }
    }
    
    $(this).trigger("change", {
    	preset: this.preset, 
    	from: this.from, 
    	to: this.to, 
    	rollup: this.rollup, 
    	timePeriodType: this.timePeriodType, 
    	timePeriods: this.timePeriods,
    	triggerRefresh: triggerRefresh
    	});
};

/**
 * Trigger the on change event
 * @param {boolean} triggerRefresh - Passed in onchange
 * @param {Object} options - Any additional options to pass along with the event
 */
TimePresetPicker.prototype.triggerChange = function(triggerRefresh, options){
	
	var data = {
	    	preset: this.preset, 
	    	from: this.from, 
	    	to: this.to, 
	    	rollup: this.rollup, 
	    	timePeriodType: this.timePeriodType, 
	    	timePeriods: this.timePeriods,
	    	triggerRefresh: triggerRefresh
	    };
    $.extend(data, options);
	
    $(this).trigger("change", data);
};

/**
 * Presets for Custom Time Periods
 * @type {Object} 
 */
TimePresetPicker.prototype.presets = {
    "PREVIOUS_DAY": {
        id: 1,
        description: "Previous day"
    },
    "PREVIOUS_WEEK": {
        id: 7,
        description: "Previous week"
    },
    "PREVIOUS_4WEEKS": {
        id: 28,
        description: "Previous 4 weeks"
    },
    "PREVIOUS_MONTH": {
        id: 5,
        description: "Previous month"
    },
    "PREVIOUS_YEAR": {
        id: 6,
        description: "Previous year"
    },
    "YESTERDAY": {
        id: 4,
        description: "Yesterday"
    },
    "LAST_WEEK": {
        id: 3,
        description: "Last week"
    },
    "LAST_MONTH": {
        id: 2,
        description: "Last month"
    },
    "LAST_YEAR": {
        id: 8,
        description: "Last year"
    },
    "DAY_TO_DATE": {
        id: 9,
        description: "Day to date"
    },
    "WEEK_TO_DATE": {
        id: 10,
        description: "Week to date"
    },
    "MONTH_TO_DATE": {
        id: 11,
        description: "Month to date"
    },
    "YEAR_TO_DATE": {
        id: 12,
        description: "Year to date"
    },
    "FIXED_TO_FIXED": {
        id: 0,
        description: "Custom time period"
    },
    "FIXED_TO_NOW": {
        id: -1,
        description: "Custom time up to now"
    },
    "INCEPTION_TO_FIXED": {
        id: -2,
        description: "First value up to custom time"
    },
    "INCEPTION_TO_NOW": {
        id: -3,
        description: "First value up to now"
    }
};

/** 
 * Select Items for Rollups
 * @type {Object}
 * @default All Rollups Available
 */
TimePresetPicker.prototype.rollups = {
	    'NONE': {
	        id: 1,
	        description: 'None'
	    },
	    'AVERAGE': {
	        id: 2,
	        description: 'Average'
	    },
	    'MAXIMUM': {
	        id: 3,
	        description: 'Maximum'
	    },
	    'MINIMUM': {
	        id: 4,
	        description: 'Minimum'
	    },
	    'SUM': {
	        id: 5,
	        description: 'Sum'
	    },
	    'FIRST': {
	        id: 6,
	        description: 'First'
	    },
	    'LAST': {
	        id: 7,
	        description: 'Last'
	    },
	    'COUNT': {
	        id: 8,
	        description: 'Count'
	    },	
	    'Integral': {
	        id: 9,
	        description: 'Integral'
	    },		
};

/** 
 * Select Items for Rollups
 * @type {Object}
 * @default All Rollups Available
 */
TimePresetPicker.prototype.timePeriodTypes = {
	    'SECONDS': {
	        id: 1,
	        description: 'Seconds'
	    },
	    'MINUTES': {
	        id: 2,
	        description: 'Minutes'
	    },
	    'HOURS': {
	        id: 3,
	        description: 'Hours'
	    },
	    'DAYS': {
	        id: 4,
	        description: 'Days'
	    },
	    'WEEKS': {
	        id: 5,
	        description: 'Weeks'
	    },
	    'MONTHS': {
	        id: 6,
	        description: 'Months'
	    }	
};


/**
 * @param {string} preset - Preset to use for calculation
 */
TimePresetPicker.calculatePeriod = function(preset) {
    var to = moment();
    var from = moment(to);
    
    switch(preset) {
    case "PREVIOUS_DAY":
        from.subtract(1, 'days');
        break;
    case "PREVIOUS_WEEK":
        from.subtract(1, 'weeks');
        break;
    case "PREVIOUS_4WEEKS":
        from.subtract(4, 'weeks');
        break;
    case "PREVIOUS_MONTH":
        from.subtract(1, 'months');
        break;
    case "PREVIOUS_YEAR":
        from.subtract(1, 'years');
        break;
    case "YESTERDAY":
        to.hours(0).minutes(0).seconds(0).milliseconds(0);
        from = moment(to).subtract(1, 'days');
        break;
    case "LAST_WEEK":
        to.weekday(0).hours(0).minutes(0).seconds(0).milliseconds(0);
        from = moment(to).subtract(1, 'weeks');
        break;
    case "LAST_MONTH":
        to.date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        from = moment(to).subtract(1, 'months');
        break;
    case "LAST_YEAR":
        to.dayOfYear(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        from = moment(to).subtract(1, 'years');
        break;
    case "DAY_TO_DATE":
        from.hours(0).minutes(0).seconds(0).milliseconds(0);
        break;
    case "WEEK_TO_DATE":
        from.weekday(0).hours(0).minutes(0).seconds(0).milliseconds(0);
        break;
    case "MONTH_TO_DATE":
        from.date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        break;
    case "YEAR_TO_DATE":
        from.dayOfYear(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        break;
    case "FIXED_TO_FIXED":
        from = null;
        to = null;
        break;
    case "FIXED_TO_NOW":
        from = null;
        break;
    case "INCEPTION_TO_FIXED":
        from = moment(0);
        to = null;
        break;
    case "INCEPTION_TO_NOW":
        from = moment(0);
        break;
    default:
        from = null;
        to = null;
        break;
    }
    
    return {from: from, to: to};
};

return TimePresetPicker;

}); // define
