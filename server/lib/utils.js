var _ = require('underscore');
var Promise = require('bluebird');

var User = require('../models/user.js');

var get = {};
get.jawbone = require('./jawbone');
get.strava = require('./strava');

// currently supported goals
var GOALS = ['Sleep', 'Step', 'Cycle', 'Run'];
//maps goals to currently supported third-party service

//note : this won't work with after we integrate fitbit,
// because there will no longer be a function from goaltype
// to provider.  there will, however, be a function from
// the pair <goalType, user> to a provider
// we can denote that by writing 'user' here
// or by replacing these with functions that return strings
// e.g.
// 'Cycle' -> function(user) { return 'strava' }
// 'SLeep' -> function(user){if (some check) return 'fitbit' else 'jawbone' }
var PROVIDER = {
  Sleep : 'jawbone',
  Step  : 'jawbone',
  Cycle : 'strava',
  Run   : 'strava'
};
//maps our names to third-parties' names
var NAME = {
  'Sleep' : 'sleeps',
  'Step'  : 'moves',
  'Cycle' : 'Ride',
  'Run'   : 'Run'
};

//coefficients
var METERS_TO_MILES = 0.000621371;
var SECONDS_TO_HOURS = 0.00027777777;

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
lib.updateUser = function(user, done){
  done || (done = function(){ /* noop */ console.log('user saved'); });

  lib.updateGoalsOfType(GOALS[0], user)
  .then(function(user){
    return lib.updateGoalsOfType(GOALS[1], user);
  })
  .then(function(user){
    return lib.updateGoalsOfType(GOALS[2], user);
  })
  .then(function(user){ // bug: currently get strava data twice, unnecessary
    return lib.updateGoalsOfType(GOALS[3], user);
  })
  .then(function(user){
    user.markModified('goals');
    return user.save();
    })
  .then(function(user){
    done(null, user);
  })
  .catch(function(error){
    console.error(error);
  })
};

var updateGoalsOfType = function(type, user, done) {
  var provider = PROVIDER[type];
  var name = NAME[type]; // the third party api's name for this goal type
  var goals = user.goals;
  var relevantGoals = lib.filterGoalsByType(type, goals);

  if (!user[provider] || relevantGoals.length === 0){
    return done(null, user); 
  }

  var token = user[provider]['token'];

  get[provider](name, token, function(err, data){
    if (data) {
      var updateGoal = _.bind(lib.updateGoal, null, type, data);
      _.each(relevantGoals, updateGoal);
    }
    done(err, user); 
  });
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
        return memo + ((datum.details.light + datum.details.sound) * SECONDS_TO_HOURS);
      } else if (type === 'Step'){
        return memo + datum.details.steps;
      } else if (type === 'Cycle' || type === 'Run'){
        return memo + (datum.distance * METERS_TO_MILES);
      }
    },0);
};

// completion check: currently only checking time, but could also check progress
lib.isCompleted = function (endTime, currentTime){
  if (endTime < currentTime){
    return true;
  }
  return false;
};

//side effect: mutates goal object
lib.updateGoal = function(type, data, goal){
  var currentTime = Date.now() / 1000;
  var startTime = goal.startTime;
  var endTime = goal.startTime + goal.period.seconds;
  var relevantData = lib.filterDataByTime(PROVIDER[type], data, startTime, endTime);

  goal.progress = Math.floor( lib.calculateProgress(relevantData, type) );
  goal.completed = lib.isCompleted(endTime, currentTime);
};

module.exports = lib;
