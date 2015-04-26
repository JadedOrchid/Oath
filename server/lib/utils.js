var _ = require('underscore');
var Promise = require('bluebird');

var User = require('../models/user.js');
var jawbone = require('./jawbone');
var strava = require('./strava');

// currently supported goals
var GOALS = ['Sleep', 'Step', 'Cycle'];

//maps goals to currently supported third-party service
var PROVIDER = {
  'Sleep' : 'jawbone',
  'Step'  : 'jawbone',
  'Cycle' : 'strava'
};
//maps our naming convention to Provider's naming convention
var NAME = {
  'Sleep' : 'sleeps',
  'Step'  : 'moves',
  'Cycle' : 'Ride'
};

//constants
var METERS_TO_MILES = 0.000621371;

//namespace
var lib = {};

// Update all goals for all users.
// This function executes every N minutes, for some small-ish N
lib.updateAllUserGoals = function(){
  User.find(function(err, users){
    users.forEach(function(user){
      lib.updateUserGoals(user);
    });
  });
};

// updates all goals for given user.
// and passes user to an optional callback after saving to DB
lib.updateUserGoals = function(user, cb){
  lib.update(GOALS[0], user)
  .then(function(user){
    return lib.update(GOALS[1], user);
  })
  .then(function(user){
    return lib.update(GOALS[2], user);
  })
  .then(function(user){
    user.markModified('goals');
    return user.save();
    })
  .then(function(user){
    console.log('saved user');
    if (cb) cb(null, user);
  })
  .catch(function(error){
    console.error(error);
  })
};

var update = function(type, user, cb) {
  var goals = user.goals;
  var relevantGoals = lib.filterGoalsByType(goals, type);
  if (relevantGoals.length === 0){
    return cb(null, user); 
  }
  var provider = PROVIDER[type];
  var name = NAME[type];
  if(!user[provider]) {
    cb(null, user); // user hasn't associated 3rd-party profile
  }
  if (provider === 'jawbone') {
    jawbone.get(name, user.jawbone.token, function(err, resp){
      if (resp) {
        var data = resp.data.items;
        var updateGoal = _.bind(lib.updateGoalUnbound, null, type, data);
        _.each(relevantGoals, updateGoal);
      }
      cb(err, user);
    });
  } else if (provider === 'strava') {
    strava.get('activities', user.strava.token, function(err,resp){
     if (resp){
       var data = _.filter(resp, function(datum){
         return datum.type === name;
       });
       var updateGoal = _.bind(lib.updateGoalUnbound, null, type, data);
       _.each(relevantGoals, updateGoal);
     }
     cb(err, user);
    });
  }
};

var jawboneUpdate = function(type, user, cb){
  if (!user.jawbone){
    cb(null,user);
  }
  var goals = user.goals;
  var relevantGoals = lib.filterGoalsByType(goals, type);
  if (relevantGoals.length === 0){
    return cb(null, user); 
  }
  jawbone.get(type, user.jawbone.token, function(err, resp){
    if (resp) {
      var data = resp.data.items;
      var updateGoal = _.bind(lib.updateGoalUnbound, null, type, data);
      _.each(relevantGoals, updateGoal);
    }
    cb(err, user);
  });
};

var stravaUpdate = function(type,user,cb){
   if (!user.strava){
    cb(null,user);
   }
   var goals = user.goals;
   var relevantGoals = lib.filterGoalsByType(goals, type);
   if (relevantGoals.length === 0){
     return cb(null, user); 
   }
   strava.get('activities', user.strava.token, function(err,resp){
    if (resp){
      var data = _.filter(resp, function(datum){
        return datum.type === type;
      });
      console.log(data);
      var updateGoal = _.bind(lib.updateGoalUnbound, null, type, data);
      _.each(relevantGoals, updateGoal);
    }
    cb(err, user);
   })
}

// export promisified version of jawbone / strava update
lib.jawboneUpdate = Promise.promisify(jawboneUpdate);
lib.stravaUpdate  = Promise.promisify(stravaUpdate);
lib.update = Promise.promisify(update);

// entire goals array -> filtered goals array
// valid types: 'Sleep', 'Step', 'Cycle'
lib.filterGoalsByType = function(goals, type){
  // return uncompleted goals of type clientType
  return _.filter(goals, function(goal){
    return (!goal.completed && goal.goalType.title === type);
  });
}

// entire data array -> filtered data array
lib.filterDataByTime = function(provider, data, startTime, endTime){
  var pluckTime = function(datum) {
    if (provider === 'jawbone'){
      return datum.time_completed;
    } else if (provider === 'strava'){
      return Date.parse(datum.start_date) / 1000;
    } else {
      console.error('provider not supported');
      return 0;
    }
  };
  return _.filter(data, function(datum){
        var timeCompleted = pluckTime(datum);
        return timeCompleted > startTime && timeCompleted < endTime ;
       });
}

lib.calculateProgress = function(relevantData, type){
  return _.reduce(relevantData, function(memo, datum){
      if (type === 'Sleep') {
        return memo + datum.details.light + datum.details.sound;
      } else if (type === 'Step'){
        return memo + datum.details.steps;
      } else if (type === 'Cycle'){
        return memo + (datum.distance * METERS_TO_MILES);
      }
    },0);
}

lib.isCompleted = function (endTime, currentTime){
  if (endTime < currentTime){
    return true;
  }
  return false;
}

//side effect: mutates goal object
lib.updateGoalUnbound = function(type, data, goal){
  var currentTime = Date.now() / 1000;
  var startTime = goal.startTime;
  var endTime = goal.startTime + goal.period.seconds;
  var relevantData = lib.filterDataByTime(PROVIDER[type], data, startTime, endTime);

  goal.progress = lib.calculateProgress(relevantData, type);
  goal.completed = lib.isCompleted(endTime, currentTime);
}

module.exports = lib;
