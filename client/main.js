 
 var counter = 0;
    
    UI.body.events({
      'click .startButton': function (e) {
        if (navigator.geolocation) { //Get the latitude and the longitude;
          navigator.geolocation.getCurrentPosition(successFunction, errorFunction); 
        }
        
      }
    });

    function successFunction(position) {
    console.log(position);
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      convertDMS(lat, lng)
    }

  function errorFunction(){
      alert("Geocoder failed");
    }

    if (navigator.geolocation) { //Get the latitude and the longitude;
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction); 
    } 
    



    function convertDMS( lat, lng ) {  //converting Longitude Latitude to Degree Minute
      
          lat =  -33.8678500;
          lng = 151.2073200;
          var convertLat = Math.abs(lat);
          var LatDeg = Math.floor(convertLat);
          var LatSec = (Math.floor((convertLat - LatDeg) * 60));
          var LatCardinal = ((lat > 0) ? 1 : -1);
           
          var convertLng = Math.abs(lng);
          var LngDeg = Math.floor(convertLng);
          var LngSec = (Math.floor((convertLng - LngDeg) * 60));
          var LngCardinal = ((lng > 0) ? 1 : -1);
          var locationObject = {};
          locationObject['Latitude'] = {};
          locationObject['Latitude']['DecimalLatitude'] = lat;      
          locationObject['Latitude']['Degree'] = LatDeg;
          locationObject['Latitude']['Minute'] = LatSec;
          locationObject['Latitude']['Cardinal'] = LatCardinal;
          locationObject['Longitude'] = {}; 
          locationObject['Longitude']['DecimalLongitude'] = lng;
          locationObject['Longitude']['Degree'] = LngDeg;
          locationObject['Longitude']['Minute'] = LngSec;
          locationObject['Longitude']['Cardinal'] = LngCardinal;  
         

            //console.log("Before Deleting"+localStorage.getItem("JSONResponse"));
             
          Meteor.call('DropLocationCollection'); // Removing Old FinalResultCollection from Collection
       
          Location.insert(locationObject);
          weatherAjax(lat,lng,locationObject);

    }

    Meteor.methods({                 // Resetting Old FinalResultCollection from Screen
              getNavyFinalResult: function(){
                console.log(this.isSimulation);
                return null;
              }
      });
    
     
    
   

    Template.list.helpers({
      tasks:function() {
        return FinalResultCollection.find();// Display Template Helper
      }
    }) 

