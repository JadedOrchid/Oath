var schedule = require('node-schedule');
var lib = require('./utils');

var rule = new schedule.RecurrenceRule();
// currently runs once / minute
var j = schedule.scheduleJob(rule, function(){
  console.log('inside recurrence');
  lib.updateAllUserGoals();
})