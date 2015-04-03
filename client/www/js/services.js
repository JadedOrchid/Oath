angular.module('starter.services', [])


.service('User', function($state) {

  this.user = {};

  this.returnGoals = function(){
    var goalTypes = [
      "Step Goal",
      "Sleep Goal",
      "Cycling Distance Goal",
      "Cycling Climbing Goal",
      "Tech Usage Goal",
      "Running Distance Goal",
      "Focus Goal"
    ];

    return goalTypes;
  };
  
  this.goalClick = function(goal){
    this.user.goalType = goal;
    $state.go('goaldetails');
  }.bind(this);
});
