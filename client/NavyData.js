 getAngle = function(sunnyTime){
    Meteor.call('getNavyFinalResult',Session.get('FinalResultCollection'),sunnyTime,function(err,result){
            if(err){
              console.log(err)
            }else{
              Meteor.call('DropFinalResultCollection'); // removing old data from the collection
              $.each(result,function(key,value){
                
                FinalResultCollection.insert(value); // inseting into final result collection 
                
               })
            
            }
           });
    }