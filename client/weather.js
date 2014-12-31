weatherAjax = function(lat,lng,locationObject){
      var sunnyTime = []
      if(FinalResultCollection.find().count() != 0){
             Meteor.call('DropFinalResultCollection');
       }
     $.ajax({
   
          'url' : "http://api.wunderground.com/api/603d511f343b6939/geolookup/hourly/q/"+lat+","+lng+".json",
          'cache' : true,
          'FinalResultCollectionType' : 'jsonp',
          'jsonpCallback' : 'cb',
          'success' : function(FinalResultCollection, textStats, XMLHttpRequest) {
          
          $.each(FinalResultCollection.hourly_forecast,function(key,value){
            
            if(value.wx=="Sunny"){
            var timeFormat = value.FCTTIME.hour+":"+value.FCTTIME.min;          
            sunnyTime.push(timeFormat);
          }     
          })
          console.log(sunnyTime);
          Meteor.call('getTimeZone',function(err,FinalResultCollection){
                if(err){
                  console.log("error")
                  console.log(err);
                }else{
                  console.log(FinalResultCollection)
                  
                  delete Session.keys['FinalResultCollection']; // Stting Session
                  Session.set('FinalResultCollection',FinalResultCollection);
                  
                }
              });

            getAngle(sunnyTime);

     
            }
        });
      
    
    }