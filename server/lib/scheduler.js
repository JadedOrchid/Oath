var schedule = require('node-schedule');
var lib = require('./utils');

var rule = new schedule.RecurrenceRule();

var j = schedule.scheduleJob(rule, function(){
  console.log('inside recurrence');
  lib.updateAllUserGoals();
})