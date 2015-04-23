var schedule = require('node-schedule');
var lib = require('./utils');

// runs at midnight each night
var j = schedule.scheduleJob({ }, function(){
  console.log('scheduled job called at', new Date());
  lib.updateAllUserGoals();
});
