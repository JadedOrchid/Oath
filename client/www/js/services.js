angular.module('starter.services', [])


.service('GoalBuilder', function($state) {
  this.goal = {};
  this.returnGoals = function(){
    var goalTypes = [
      {
        title: "Step Goal",
        unit: "steps"
      },
      {
        title: "Sleep Goal",
        unit: "hours"
      },
      {
        title: "Cycling Distance Goal",
        unit: "miles"
      },
      {
        title: "Cycling Climbing Goal",
        unit: "feet"
      },
      {
        title: "Tech Usage Goal",
        unit: "minutes"
      },
      {
        title: "Running Distance Goal",
        unit: "miles"
      },
      {
        title: "Focus Goal",
        unit: "minutes"
      }
    ];

    return goalTypes;
  };

  this.goalClick = function(goal){
    this.goal.goalType = goal;
    $state.go('goaldetails');
  }.bind(this);

  this.returnSucesses = function(){
    var successTypes = [
      {
        orgName: 'Arbor Day Foundation',
        description: 'Plant a trees!',
        price: '$5',
        img: 'imgurl'
      },
      {
        orgName: 'Red Cross',
        description: 'Buy a vaccination',
        price: '$5',
        img: 'imgurl'
      },
      {
        orgName: 'TerraPass',
        description: 'Offset a flight',
        price: '$5',
        img: 'imgurl'
      }
    ];
    return successTypes;
  }


  this.successClick = function(success){
    this.goal.success = success;
  }.bind(this);

  this.returnTimes = function(){
    var times = [
      "One Day",
      "One Week",
      "One Month",
      "One Year"
    ];
    return times;
  }
});
