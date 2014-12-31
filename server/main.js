var timezoner = Meteor.npmRequire('timezoner');
var cheerio = Meteor.npmRequire('cheerio');
var request = Meteor.npmRequire('request');
  


  Meteor.startup(function(){  // remove all data from collections at startup
    var globalObject=Meteor.isClient?window:global;
    for(var property in globalObject){
      var object=globalObject[property];
      if(object instanceof Meteor.Collection){
        object.remove({});
      }
    }
  });

  return Meteor.methods({

    DropFinalResultCollection: function() {

      return FinalResultCollection.remove({});

    },

    DropLocationCollection: function() {

      return Location.remove({});

    },

    getTimeZone: function(){

      var locationObjectObject = Location.findOne({});
            //console.log(locationObjectObject);
            var timezoneObject = {}
            
            var timeZoneFunction = Meteor.sync(function(done){
              timezoner.getTimeZone(
              locationObjectObject.Latitude.DecimalLatitude, // Latitude coordinate
              locationObjectObject.Longitude.DecimalLongitude, // Longitude coordinate
              done);
            }
            );
            if(timeZoneFunction.error){
              throw new Meteor.error(404,"Please Provide Valid Longitude Latitude")
            }
            else{
              var timezoneObject = {};
              var timezone = 0;
              var timezoneSign = 0;
              timezone = (timeZoneFunction.result.rawOffset+timeZoneFunction.result.dstOffset)/3600;
              //console.log("this"+timezone);
              if(timezone < 1){
                timezoneSign = -1;
              }else {
                timezoneSign = 1;
              }
              timezoneObject['timezone'] = Math.abs(timezone);
              timezoneObject['timezoneSign'] = timezoneSign;
              console.log(timezoneObject);
              return timezoneObject;
            }
          //return a;
         //return TimeZone.find();
      //callback('tz='+Math.abs(timezone)+'&tz_sign='+timezoneSign+'');
    },
    getNavyFinalResult: function(timezone,sunnyTime){
      console.log(timezone);
      var FinalResultCollection    
      var date = new Date();
      var LocationObject = Location.findOne();

      var url = 'http://aa.usno.navy.mil/cgi-bin/aa_altazw.pl?form=2&body=10&year='+date.getFullYear()+'&month='+date.getMonth()+'&day='+date.getDate()+'&intv_mag=60&place=%28no+name+given%29&lon_sign='+LocationObject.Longitude.Cardinal+'&lon_deg='+LocationObject.Longitude.Degree+'&lon_min='+LocationObject.Longitude.Minute+'&lat_sign='+LocationObject.Latitude.Cardinal+'&lat_deg='+LocationObject.Latitude.Degree+'&lat_min='+LocationObject.Latitude.Minute+'&tz='+timezone.timezone+'&tz_sign='+timezone.timezoneSign+'';
      result = Meteor.http.get(url);
      console.log(url);
      var item1 = [];
          
          var $ = cheerio.load(result.content);
          var FinalResultCollection = $('pre').text()
         
      console.log(FinalResultCollection);
      var arr = FinalResultCollection.split("\n");
      for(var i=0;i<arr.length;i++){
        if (arr[i].trim().match(/[0-9]{2}:[0-9]{2}\s[0-9]*\s[0-9]*/)){ // checking the regex for table row
          var item = {};
          item.time = arr[i].trim().match(/([0-9]{2}:[0-9]{2})/g)[0].trim(); // extracting time from the row
          item.angle = arr[i].trim().match(/(\s{3,10}-*[0-9]?.*[0-9]*\s)/)[0].trim(); // extracting angle from the row
          //console.log(sunnyTime.length);
          if(item.angle > 50){ //checking both the conditions
            $.each(sunnyTime,function(key,value){
              if(value==item.time.trim()){
                //console.log("timeMatches");
                item1.push(item);
              }    
            })

          }


        }

      }
      console.log(item1)
      return item1;

    }



  });



