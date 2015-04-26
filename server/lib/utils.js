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
//maps our names to third-parties' names
var NAME = {
  'Sleep' : 'sleeps',
  'Step'  : 'moves',
  'Cycle' : 'Ride'
};
// maps providers to a method to parse their API responses
var PARSE = {
  jawbone : function(response, type) {
    return response.data.items;
  },
  strava : function(response, type) {
    var name = NAME[type];
    return _.filter(response, function(datum){
      return datum.type === name;
    });
  }
};

//constants
var METERS_TO_MILES = 0.000621371;

//namespace
var lib = {};

// Update all goals for all users.
// This function executes every N minutes, for some small-ish N
lib.updateAllUsers = function(){
  User.find(function(err, users){
    users.forEach(function(user){
      lib.updateUser(user);
    });
  });
};

// updates all goals for given user.
// and passes user to an optional callback after saving to DB
lib.updateUser = function(user, callback){
  lib.updateGoalsOfType(GOALS[0], user)
  .then(function(user){
    return lib.updateGoalsOfType(GOALS[1], user);
  })
  .then(function(user){
    return lib.updateGoalsOfType(GOALS[2], user);
  })
  .then(function(user){
    user.markModified('goals');
    return user.save();
    })
  .then(function(user){
    console.log('saved user');
    if (callback) callback(null, user);
  })
  .catch(function(error){
    console.error(error);
  })
};

var updateGoalsOfType = function(type, user, done) {
  var goals = user.goals;
  var relevantGoals = lib.filterGoalsByType(type, goals);
  if (relevantGoals.length === 0){
    return done(null, user); 
  }
  var provider = PROVIDER[type];
  var name = NAME[type];
  if(!user[provider]) {
    done(null, user); // user hasn't associated 3rd-party profile
  }
  if (provider === 'jawbone') {
    jawbone.get(name, user.jawbone.token, callback);
  } else if (provider === 'strava') {
    strava.get('activities', user.strava.token, callback);
  } else {
    console.error('provider not currently supported');
  }
  function callback(err, resp){
    if (resp) {
      var data = PARSE[provider](resp,type)
      var updateGoal = _.bind(lib.updateGoalUnbound, null, type, data);
      _.each(relevantGoals, updateGoal);
    }
    done(err, user);
  }
};

// export promisified version of jawbone / strava update
lib.updateGoalsOfType = Promise.promisify(updateGoalsOfType);

// entire goals array -> filtered goals array
// valid types: 'Sleep', 'Step', 'Cycle'
lib.filterGoalsByType = function(type, goals){
  // return uncompleted goals of type clientType
  return _.filter(goals, function(goal){
    return (!goal.completed && goal.goalType.title === type);
  });
};

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
};

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
};

lib.isCompleted = function (endTime, currentTime){
  if (endTime < currentTime){
    return true;
  }
  return false;
};

//side effect: mutates goal object
lib.updateGoalUnbound = function(type, data, goal){
  var currentTime = Date.now() / 1000;
  var startTime = goal.startTime;
  var endTime = goal.startTime + goal.period.seconds;
  var relevantData = lib.filterDataByTime(PROVIDER[type], data, startTime, endTime);

  goal.progress = lib.calculateProgress(relevantData, type);
  goal.completed = lib.isCompleted(endTime, currentTime);
};

module.exports = lib;
