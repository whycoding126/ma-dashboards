       //Create Custom Data Provider To Compute kWh
       var dataProviders = new Array();
       var kwhDataProvider = new PointValueDataProvider(1, {manipulateData: function(pointValues, dataPoint){
           var newData = new Array();
           if(pointValues.length == 0)
               return newData;

           var previous = pointValues[0]
           //Subtract previous value from current.
           for(var i=1; i<pointValues.length; i++){
               var current = pointValues[i];
               var entry = {
                       value: current.value - previous.value,
                       timestamp: current.timestamp
               };
               newData.push(entry);
               
               //Move along
               previous = current;
           }
           
           return newData;
       }});
       dataProviders.push(kwhDataProvider);
       