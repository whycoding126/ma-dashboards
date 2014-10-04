/**
 * DataProviderID | DataProvider Type | Point Name:
 *      1            CustPointValue              kWh
 *      2               Realtime            Phase A Amps
 *      3               Realtime            Phase B Amps
 *      4               Realtime            Phase C Amps
 *      5               PointValue          Phase A Amps
 *      6               PointValue          Phase B Amps
 *      7               PointValue          Phase C Amps
 *      8               Realtime            Voltage A-N 
 *      9               Realtime            Voltage A-N 
 *      10              Realtime            Voltage A-N 
 *      11              PointValue          Voltage A-N 
 *      12              PointValue          Voltage A-N 
 *      13              PointValue          Voltage A-N 
 *      14              Realtime            Real Power A 
 *      15              Realtime            Real Power B
 *      16              Realtime            Real Power C
 *      17              PointValue          Real Power A 
 *      18              PointValue          Real Power B
 *      19              PointValue          Real Power C
 *      20              Realtime            Power Factor A 
 *      21              Realtime            Power Factor B
 *      22              Realtime            Power Factor C
 *      23              PointValue          Power Factor A 
 *      24              PointValue          Power Factor B
 *      25              PointValue          Power Factor C
 * 
 * 
 * 
 * 
 * 
 */
//Setup Point Configurations
var pointConfigurations = new Array();

/**
 * Kilo Watts per hour
 */
pointConfigurations.push(new DataPointMatchConfiguration(1, [ {
    matchAttribute : 'name',
    regex : /.*\(kWh\)/
} ]));

/**
 * **** CURRENT ******
 */
// Phase A Amps (Realtime)
pointConfigurations.push(new DataPointMatchConfiguration(2, [ {
    matchAttribute : 'name',
    regex : /Phase A \(A\)/g
} ], {
    providerType : 'RealtimePointValue'
}));

// Phase B Amps (Realtime)
pointConfigurations.push(new DataPointMatchConfiguration(3, [ {
    matchAttribute : 'name',
    regex : /Phase B \(A\)/g
} ], {
    providerType : 'RealtimePointValue'
}));

// Phase C Amps (Realtime)
pointConfigurations.push(new DataPointMatchConfiguration(4, [ {
    matchAttribute : 'name',
    regex : /Phase C \(\A\)/g
} ], {
    providerType : 'RealtimePointValue'
}));

//Phase A Amps (PointValue)
pointConfigurations.push(new DataPointMatchConfiguration(5, [ {
    matchAttribute : 'name',
    regex : /Phase A\ \(A\)/g
} ], {
    providerType : 'PointValue'
}));

// Phase B Amps (PointValue)
pointConfigurations.push(new DataPointMatchConfiguration(6, [ {
    matchAttribute : 'name',
    regex : /Phase\ B\ \(A\)/g
} ], {
    providerType : 'PointValue'
}));

// Phase C Amps (Realtime)
pointConfigurations.push(new DataPointMatchConfiguration(7, [ {
    matchAttribute : 'name',
    regex : /Phase C \(A\)/g
} ], {
    providerType : 'PointValue'
}));


/**
 * **** VOLTAGE ******
 */
//Voltage A-N (Realtime)
pointConfigurations.push(new DataPointMatchConfiguration(8, [ {
    matchAttribute : 'name',
    regex : /Voltage A-N \(V\)/g
} ], {
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(9, [ {
matchAttribute : 'name',
regex : /Voltage\ B-N\ \(V\)/g
} ], {
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(10, [ {
matchAttribute : 'name',
regex : /Voltage\ \C-N\ \(V\)/g
} ], {
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(11, [ {
    matchAttribute : 'name',
    regex : /Voltage A-N \(V\)/g
} ], {
    providerType : 'PointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(12, [ {
matchAttribute : 'name',
regex : /Voltage\ B-N\ \(V\)/g
} ], {
    providerType : 'PointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(13, [ {
matchAttribute : 'name',
regex : /Voltage\ \C-N\ \(V\)/g
} ], {
    providerType : 'PointValue'
}));

/**
 * **** REAL POWER ******
 */
pointConfigurations.push(new DataPointMatchConfiguration(14, [ {
matchAttribute : 'name',
regex : /Real\ Power\ A\ \(kW\)/g
} ],{
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(15, [ {
matchAttribute : 'name',
regex : /Real\ Power\ B\ \(kW\)/g
} ],{
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(16, [ {
matchAttribute : 'name',
regex : /Real\ Power\ C\ \(kW\)/g
} ],{
    providerType : 'RealtimePointValue'
}));
    
pointConfigurations.push(new DataPointMatchConfiguration(17, [ {
matchAttribute : 'name',
regex : /Real\ Power\ A\ \(kW\)/g
} ],{
    providerType : 'PointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(18, [ {
matchAttribute : 'name',
regex : /Real\ Power\ B\ \(kW\)/g
} ],{
    providerType : 'PointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(19, [ {
matchAttribute : 'name',
regex : /Real\ Power\ C\ \(kW\)/g
} ],{
    providerType : 'PointValue'
}));


/**
 * **** POWER FACTOR ******
 */

pointConfigurations.push(new DataPointMatchConfiguration(20, [ {
matchAttribute : 'name',
regex : /Power\ Factor\ A/g
} ],{
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(21, [ {
matchAttribute : 'name',
regex : /Power\ Factor\ B/g
} ],{
    providerType : 'RealtimePointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(22, [ {
matchAttribute : 'name',
regex : /Power\ Factor\ C/g
} ],{
    providerType : 'RealtimePointValue'
}));
    
pointConfigurations.push(new DataPointMatchConfiguration(23, [ {
matchAttribute : 'name',
regex : /Power\ Factor\ A/g
} ],{
    providerType : 'PointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(24, [ {
matchAttribute : 'name',
regex : /Power\ Factor\ B/g
} ],{
    providerType : 'PointValue'
}));

pointConfigurations.push(new DataPointMatchConfiguration(25, [ {
matchAttribute : 'name',
regex : /Power\ Factor\ C/g
} ],{
    providerType : 'PointValue'
}));



//pointConfigurations.push(new DataPointMatchConfiguration(5, [ {
//    matchAttribute : 'name',
//    regex : /.*\(kWh\)/
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(6, [ {
//    matchAttribute : 'name',
//    regex : /Phase\ \A\ \(A\)/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(7, [ {
//    matchAttribute : 'name',
//    regex : /Phase\ \B\ \(\A\)/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(8, [ {
//    matchAttribute : 'name',
//    regex : /\Phase\ C\ \(A\)/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(9, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ \A-N\ \(V\)/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(10, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ B-N\ \(V\)/g,
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(11, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ C-N\ \(V\)/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(12, [ {
//    matchAttribute : 'name',
//    regex : /kWh/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(13, [ {
//    matchAttribute : 'name',
//    regex : /\(kWh\)/g
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(14, [ {
//    matchAttribute : 'name',
//    regex : /\(kWh\)/g,
//} ], {
//    providerType : 'Statistics'
//}));
//
//pointConfigurations.push(new DataPointMatchConfiguration(15, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ A-N\ \(V\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(16, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ B-N\ \(V\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(17, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ \C-N\ \(V\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(18, [ {
//    matchAttribute : 'name',
//    regex : /Real\ Power\ A\ \(kW\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(19, [ {
//    matchAttribute : 'name',
//    regex : /Real\ Power\ B\ \(kW\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(20, [ {
//    matchAttribute : 'name',
//    regex : /Real\ Power\ C\ \(kW\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(21, [ {
//    matchAttribute : 'name',
//    regex : /Power\ Factor\ A/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(22, [ {
//    matchAttribute : 'name',
//    regex : /Power\ Factor\ B/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(23, [ {
//    matchAttribute : 'name',
//    regex : /Power\ Factor\ C/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(24, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ A-N\ \(V\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(25, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ B-N\ \(V\)/g
//} ]));
//
//pointConfigurations.push(new DataPointMatchConfiguration(26, [ {
//    matchAttribute : 'name',
//    regex : /Voltage\ C-N\ \(V\)/g
//} ]));