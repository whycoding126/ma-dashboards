/**
 * DataProviderID | DataProvider Type | Point Name:
 *      1            CustPointValue              kWh
 *      2               Realtime            Current Phase A (A)
 *      3               Realtime            Current Phase B (A)
 *      4               Realtime            Current Phase C (A)
 *      5               PointValue          Current Phase A (A)
 *      6               PointValue          Current Phase B (A)
 *      7               PointValue          Current Phase C (A)
 *      8               Realtime            Voltage A-N 
 *      9               Realtime            Voltage B-N 
 *      10              Realtime            Voltage C-N 
 *      11              PointValue          Voltage A-N 
 *      12              PointValue          Voltage B-N 
 *      13              PointValue          Voltage C-N 
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
 *      26              Statistics          Current Phase A (A)
 *      27              Statistics          Current Phase B (A)
 *      28              Statistics          Current Phase C (A)
 *      29              Statistics          Voltage A-N (V)
 *      30              Statistics          Voltage B-N (V)
 *      31              Statistics          Voltage C-N (V)
 *      32              Statistics          Real Power A (kW)
 *      33              Statistics          Real Power B (kW)
 *      34              Statistics          Real Power C (kW)
 *      35              Statistics          Power Factor A
 *      36              Statistics          Power Factor B
 *      37              Statistics          Power Factor C
 *      38              Statistics               kWh
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


/**
 * Statistics for Amps
 */
pointConfigurations.push(new DataPointMatchConfiguration(26, [ {
    matchAttribute : 'name',
    regex : /Phase A \(A\)/g
} ], {
    providerType : 'Statistics'
}));

// Phase B Amps (Statistics)
pointConfigurations.push(new DataPointMatchConfiguration(27, [ {
    matchAttribute : 'name',
    regex : /Phase B \(A\)/g
} ], {
    providerType : 'Statistics'
}));

// Phase C Amps (Statistics)
pointConfigurations.push(new DataPointMatchConfiguration(28, [ {
    matchAttribute : 'name',
    regex : /Phase C \(\A\)/g
} ], {
    providerType : 'Statistics'
}));

/**
 * Statistics for Voltage
 */
//Voltage A-N (Statistics)
pointConfigurations.push(new DataPointMatchConfiguration(29, [ {
    matchAttribute : 'name',
    regex : /Voltage A-N \(V\)/g
} ], {
    providerType : 'Statistics'
}));

pointConfigurations.push(new DataPointMatchConfiguration(30, [ {
matchAttribute : 'name',
regex : /Voltage\ B-N\ \(V\)/g
} ], {
    providerType : 'Statistics'
}));

pointConfigurations.push(new DataPointMatchConfiguration(31, [ {
matchAttribute : 'name',
regex : /Voltage\ \C-N\ \(V\)/g
} ], {
    providerType : 'Statistics'
}));

/**
 * Statistics for Real Power
 */
pointConfigurations.push(new DataPointMatchConfiguration(32, [ {
    matchAttribute : 'name',
    regex : /Real\ Power\ A\ \(kW\)/g
    } ],{
        providerType : 'Statistics'
    }));

    pointConfigurations.push(new DataPointMatchConfiguration(33, [ {
    matchAttribute : 'name',
    regex : /Real\ Power\ B\ \(kW\)/g
    } ],{
        providerType : 'Statistics'
    }));

    pointConfigurations.push(new DataPointMatchConfiguration(34, [ {
    matchAttribute : 'name',
    regex : /Real\ Power\ C\ \(kW\)/g
    } ],{
        providerType : 'Statistics'
    }));



/**
 * Statistics for Power Factor
 */
    pointConfigurations.push(new DataPointMatchConfiguration(35, [ {
        matchAttribute : 'name',
        regex : /Power\ Factor\ A/g
        } ],{
            providerType : 'Statistics'
        }));

        pointConfigurations.push(new DataPointMatchConfiguration(36, [ {
        matchAttribute : 'name',
        regex : /Power\ Factor\ B/g
        } ],{
            providerType : 'Statistics'
        }));

        pointConfigurations.push(new DataPointMatchConfiguration(37, [ {
        matchAttribute : 'name',
        regex : /Power\ Factor\ C/g
        } ],{
            providerType : 'Statistics'
        }));

        /**
         * Kilo Watts per hour
         */
        pointConfigurations.push(new DataPointMatchConfiguration(38, [ {
            matchAttribute : 'name',
            regex : /.*\(kWh\)/
        } ], {
            providerType: "Statistics"
        }));
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


pointConfigurations.push(new DataPointMatchConfiguration(5, [ {
    matchAttribute : 'name',
    regex : /.*\(kWh\)/
} ], {
    providerType : 'Statistics'
}));

