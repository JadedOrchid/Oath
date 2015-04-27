var schedule = require('node-schedule');
var lib = require('./utils');

var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 5);

var j = schedule.scheduleJob({}, function(){
  console.log('scheduled job called at ', new Date());
  lib.updateAllUsers();
});
