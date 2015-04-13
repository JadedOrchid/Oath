// don't we really care about AVERAGE sleep time / day over 1 week, not TOTAL ?

var User = require('../models/user.js');
var jawbone = require('./jawbone');
var _ = require('underscore');

//namespace
var lib = {};

lib.updateAllUserGoals = function(){
  // possible bug: we're currently finding all users, and then trying to save them
  // one-by-one.  If this doesn't work, we can wait for all individual users to 
  // update and then re-save the array
  User.find(function(err, users){
    for (var i = 0; i < users.length; i++){
      var user = users[i];
      jawboneUpdate('sleep', user, function(user){
        jawboneUpdate('moves', user, function(user){
          user.save(function(err){
            console.log('User saved');
          });
        });
      });
    }
  });
};

module.exports = lib;

function jawboneUpdate(type, user, cb){
  var goals = user.goals;
  var relevantGoals = filterGoalsByType(goals, type);
  if (relevantGoals.length === 0){
    return cb(user);  // put inside a setTimeout?
  }
  jawbone.get(type, user.jawbone.token, function(err, resp){
    var data = resp.data.items;
    var updateGoal = _.bind(updateGoalUnbound, null, data);
    _.each(relevantGoals, updateGoal);
    cb(user);
  });
}

// entire goals array -> filtered goals array
// valid types: 'sleep', 'moves'
function filterGoalsByType(goals, type){
  var clientType;
  if (type === 'sleep'){
    clientType = 'Sleep Goal';
  } else if (type === 'moves'){
    clientType = 'Step Goal';
  } else{
    console.error('invalid type');
  }
  // return uncompleted goals of type clientType
  return _.filter(goals, function(goal){
    return (!goal.completed && goal.goalType.title === clientType);
  });
}

// entire data array -> filtered data array
function filterJawboneDataByTime(data, startTime, endTime){
  return _.filter(data, function(datum){
        //return data where time completed is between start and endtime
         return datum.time_completed > startTime && datum.time_completed < endTime ;
       });
}

function calculateProgress(relevantData, type){
  var path;
  if (type === 'sleep'){
    path = 'duration';
  } else if (type === 'moves'){
    path = 'steps';
  } else {
    console.error('invalid type');
  }
  return _.reduce(relevantData, function(memo, datum){
        return memo + datum.details[path];
      },0);
}

function isCompleted (endTime, currentTime){
  if (currentTime > endTime){
    return true;
  } else {
    return false;
  }
}

//side effect: mutates goal object
function updateGoalUnbound(data, goal){
  var currentTime = + new Date();
  var startTime = goal.startTime;
  var endTime = goal.startTime + goal.period.millis;
  var relevantData = filterJawboneDataByTime(data, startTime, endTime);

  goal.progress = calculateProgress(relevantData, type);
  goal.completed = isCompleted(endTime, currentTime);

}


