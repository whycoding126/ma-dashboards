    /*
    * PLEASE DOC ALL THINGS so that we canb use this as a example later
    * class College JavaScript // fixme naming and what.  
    *setting up the global var for the templater so that we can use in things like listviews and other widgets that are from custom classes
    */
    var templater;
   
   
    /*
    * Fires when the everything is ready to show
    */
   $( document ).ready(function(){


       //Setup Groups
       var meterGroups = new DataPointGroupConfiguration({
           groupBy: 'Folder',
           labelAttribute: 'name',
           matchConfigurations: [{ matchAttribute: 'path', regex: /\/Buildings\/City Plex\/Meters\/M.*/ }]
           }
       );
       
       
       /**
       * Setting up the Grouper Araary
       */
       var groupConfigurations = new Array();
       
       /**
       * Adding the Meters Group to the COnfig so that it can be passed off to the templater
       */
       groupConfigurations.push(meterGroups);
       
       /**
       *Create a custom grouper for bootstraps listgroup element
       */
       var groupSelectView = new ListViewConfiguration(
        'groupsList', 
        {},

        /*
        * Adding Custom Class tags to the object of the JQuery Mobiles ListView
        */
        {styleClass: "btn"}
        );
       
       /**
       *Setting upo the main Templater and adding all the vars ans what not to the Display
       */
       var templaterConfig = {
               debug: true,
               type: 'PointHierarchy',
               displayConfigurations: displayConfigurations,
               pointConfigurations: pointConfigurations,
               groupConfigurations: groupConfigurations,
               dataProviders: dataProviders,
               groupSelectConfiguration: groupSelectView,
               loadGroupAtStartup: 0, //GroupId to load
       }
       
       templater = new DashboardTemplater(templaterConfig);

            
   });// End When page Ready
   
        /**
        * Display Errors method
        */
        function showError(jqXHR, textStatus, errorThrown, mangoMessage){
            var msg = "";
            if(textStatus != null)
                msg += (textStatus + " ");
            if(errorThrown != null)
                msg += (errorThrown + " ");
            if(mangoMessage != null)
                msg += (mangoMessage + " ");
            msg += "\n";
            $("#errors").text(msg);
        }

