// don't we really care about AVERAGE sleep time / day over 1 week, not TOTAL ?

var User = require('../models/user.js');
var jawbone = require('./jawbone');
var _ = require('underscore');

//namespace
var lib = {};

lib.updateAllGoals = function(){
  User.find(function(err, users){
    for (var i = 0; i < users.length; i++){
      var user = users[i];
      jawboneUpdate('sleep', user, function(user){
        jawboneUpdate('moves', user, function(user){
          user.save(function(err){
            // good god
          });
        });
      });
    }
  });
};

module.exports = lib;

function jawboneUpdate(type, user cb){
  var clientType, path;
  // config
  if (type === 'sleep'){
    clientType = 'Sleep Goal';
    path = 'duration';
  } else if (type === 'moves'){
    clientType = 'Step Goal';
    path = 'steps';
  } else {
    // error: only sleep and moves currently supported
  }
  
  var goals = user.goals;
  var relevantGoals = _.filter(goals, function(goal){
    return (!goal.completed && goal.goalType.title === clientType); 
    // check if past end time?
  });
  if (relevantGoals.length === 0){
    return cb(user);
  }
  jawbone.get(type, user.jawbone.token, function(err, resp){
    var currentTime = + new Date();
    _.each(relevantGoals, function(goal){
      var startTime = goal.startTime;
      var endTime = goal.startTime + goal.period.millis;

      var relevantData = _.filter(resp.data.items, function(data){
        return data.time_completed > startTime && data.time_completed < endTime ;
      });
      var newTotal = _.reduce(relevantData, function(memo, datum){
        return memo + datum.details[path];
      },0);
      goal.progress = newTotal; 
      if (endTime < currentTime){
        goal.completed = true;
      }
    });
  });
}



// lib.updateSleeps = function(user, cb){
//   var goals = user.goals;
//   var sleepGoals = _.filter(goals, function(goal){
//     return (!goal.completed && goal.goalType.title === "Sleep Goal"); 
//     // check if past end time?
//   })
//   if (sleepGoals.length === 0){
//     return cb(user);
//   }
//   jawbone.get('sleeps', user.jawbone.token, function(err, resp) {
//     var currentTime = + new Date();
//     _.each(sleepGoals, function(goal){
//       var startTime = goal.startTime;
//       var endTime = goal.startTime + goal.period.millis;

//       var relevantSleeps = _.filter(resp.data.items, function(sleep){
//         return sleep.time_completed > startTime && sleep.time_completed < endTime ;
//       });
//       var totalSleepTime = _.reduce(relevantSleeps, function(memo, sleep){
//         return memo + sleep.details.duration;
//       },0);

//       goal.progress = totalSleepTime; 
//       if (endTime < currentTime){
//         goal.completed = true;
//       }
//     });
//     cb(user)
//   });
// };

// lib.updateSteps = function(user, cb){
//   var goals = user.goals;
//   var stepGoals = _.filter(goals, function(goal){
//     return (!goal.completed && goal.goalType.title === "Step Goal"); 
//     // check if past end time?
//   })
//   if (stepGoals.length === 0){
//     return cb(user);
//   }
//   jawbone.get('moves', user.jawbone.token, function(err, resp) {
//     var currentTime = + new Date();
//     _.each(stepGoals, function(goal){
//       var startTime = goal.startTime;
//       var endTime = goal.startTime + goal.period.millis;

//       var relevantMoves = _.filter(resp.data.items, function(move){
//         return move.time_completed > startTime && move.time_completed < endTime ;
//       });
//       var totalSteps = _.reduce(relevantMoves, function(memo, move){
//         return memo + move.details.steps;
//       },0);

//       goal.progress = totalSteps; 
//       if (endTime < currentTime){
//         goal.completed = true;
//       }
//     });
//     cb(user)
//   });
// };

