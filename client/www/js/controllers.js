angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GoalDetailCtrl', function($scope, User, $stateParams, $state){
  User.goal.timeframe = null;
  User.goal.unitInput = null;

  // $scope.unitInput;
  $scope.goalType = User.goal.goalType;
  $scope.times = [
    "One Day",
    "One Week",
    "One Month",
    "One Year"
  ];
  $scope.clicked = function(timeframe, unitInput){
    User.goal.timeframe = this.timeframe;
    User.goal.unitInput = this.unitInput;
    console.log("This is User.goal", User.goal);
    console.log("This is this: ", this);
  }

})

.controller('GoalCtrl', function($scope, User, $stateParams, $state) {
  $scope.goalTypes = User.returnGoals();
  $scope.goalClick = User.goalClick;  
});
