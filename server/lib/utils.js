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
      if (!user.jawbone) continue;
      
      lib.jawboneUpdate('sleeps', user, function(user){
        lib.jawboneUpdate('moves', user, function(user){
          user.markModified('goals');
          user.save(function(err){
            if (err) console.log(err);

            console.log('User saved');
          });
        });
      });
    }
  });
};

lib.jawboneUpdate = function(type, user, cb){
  var goals = user.goals;
  var relevantGoals = lib.filterGoalsByType(goals, type);
  if (relevantGoals.length === 0){
    return cb(user);  // put inside a setTimeout?
  }
  jawbone.get(type, user.jawbone.token, function(err, resp){
    var data = resp.data.items;
    var updateGoal = _.bind(lib.updateGoalUnbound, null, type, data);
    _.each(relevantGoals, updateGoal);
    cb(user);
  });
}

// entire goals array -> filtered goals array
// valid types: 'sleep', 'moves'
lib.filterGoalsByType = function(goals, type){
  var clientType;
  if (type === 'sleeps'){
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
lib.filterJawboneDataByTime = function(data, startTime, endTime){
  return _.filter(data, function(datum){
        //return data where time completed is between start and endtime
         return datum.time_completed > startTime && datum.time_completed < endTime ;
       });
}

lib.calculateProgress = function(relevantData, type){
  return _.reduce(relevantData, function(memo, datum){
      if (type === 'sleeps') {
        return memo + datum.details.light + datum.details.sound;
      } else if (type === 'moves'){
        return memo + datum.details.steps;
      }
    },0);
}

lib.isCompleted = function (endTime, currentTime){
  //Maybe allow goal to end early if target is met, handled here
  if (currentTime > endTime){
    return true;
  } else {
    return false;
  }
}

//side effect: mutates goal object
lib.updateGoalUnbound = function(type, data, goal){
  var currentTime = + new Date();
  var startTime = goal.startTime;
  var endTime = goal.startTime + goal.period.seconds;
  var relevantData = lib.filterJawboneDataByTime(data, startTime, endTime);

  goal.progress = lib.calculateProgress(relevantData, type);
  goal.completed = lib.isCompleted(endTime, currentTime);
}

module.exports = lib;

