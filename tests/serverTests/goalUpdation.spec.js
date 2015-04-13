var lib = require('../../server/lib/utils');

describe("Unit Testing Updation", function () {

  beforeEach(function() {
    // spyOn($state, 'go');
  });

  describe('UPDATE ALL USER GOALS', function(){
    it('Should update deets', function() {
      
    });
  });

  describe('jawboneUpdate(<type>, <user>, <cb>', function(){
    it('Should not be wrong', function() {
      
    });
  });
  describe('filterJawboneDataByTime(<data>, <start time>, <end time>)', function(){
    var data = [
      {
        time_completed: 0
      },
      {
        time_completed: 10
      },
      {
        time_completed: 100
      },
      {
        time_completed: 200
      }
    ]
    it('Should return data that was completed between start and end time', function() {
      var arr = lib.filterJawboneDataByTime(data, 4, 101);
      expect(arr.length).toBe(2);
    });
  });
  describe('filterGoalsByType(<goals>, <type>)', function(){
    var goals = [
      {
        goalType: { title: 'Sleep Goal' },
        time_completed: 0,
        completed: false
      },
      {
        goalType: { title: 'Sleep Goal' },
        time_completed: 10,
        completed: false
      },
      {
        goalType: { title: 'Step Goal' },
        time_completed: 100,
        completed: false
      },
      {
        goalType: { title: 'Technology Goal' },
        time_completed: 200,
        completed: false
      },
      {
        goalType: { title: 'Sleep Goal' },
        time_completed: 10,
        completed: true
      },
      {
        goalType: { title: 'Step Goal' },
        time_completed: 100,
        completed: true
      }
    ]
    it('Should return data that was filtered by "completed" and goaltype', function() {
      var arr = lib.filterGoalsByType(goals, 'sleeps');
      arr.forEach(function(goal){
        expect(goal.goalType.title).toBe('Sleep Goal');
        expect(goal.completed).toBe(false);
      })
    });
  });

  describe('isCompleted(<end time>, <current time>)', function(){
    it('Should return a boolean', function() {
      var endTime = 0;
      var currentTime = 0;
      var completed = lib.isCompleted(endTime, currentTime);
      expect(typeof completed).toBe('boolean');
    });
    it('Should return true for completed goals', function() {
      var endTime = 30;
      var currentTime = 40;
      var completed = lib.isCompleted(endTime, currentTime);
      expect(completed).toBe(true);
    });
    it('Should return false for incompleted goals', function() {
      var endTime = 40;
      var currentTime = 30;
      var completed = lib.isCompleted(endTime, currentTime);
      expect(completed).toBe(false);
      
    });
  });

  describe('calculateProgress()', function(){
    var data = [
    { 
      details: {
        steps: 0
      }
    },
    {
      details: {
        steps: 10000
      }
    }, 
    {
      details: {
        steps: 20000
      }
    }
    ]
    it('Should reduce correctly', function() {
      var progress = lib.calculateProgress(data, 'moves');
      expect(progress).toBe(30000);
    });
  });


  describe('updateGoalUnbound(<data>,<goal>)', function(){
    var NOW = + new Date();
    var data = [
    { 
      details: {
        steps: 0
      },
      time_completed: NOW - 50
    },
    {
      details: {
        steps: 10000
      },
      time_completed: NOW - 200
    }, 
    {
      details: {
        steps: 20000
      },
      time_completed: NOW - 60
    }
    ];
    var goal = {
      goalType: { title: 'Step Goal'},
      startTime: NOW - 100,
      period: {
        millis: 80
      }
    }
    it('Should update goal correctly', function() {
      lib.updateGoalUnbound('moves', data, goal);
      expect(goal.progress).toBe(20000);
      expect(goal.completed).toBe(true);
    });
  });

});

