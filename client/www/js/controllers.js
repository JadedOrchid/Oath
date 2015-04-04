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
  $scope.updateGoal = function(timeframe, unitInput){
    User.goal.timeframe = this.timeframe;
    User.goal.unitInput = this.unitInput;
  }

})

.controller('GoalCtrl', function($scope, User, $stateParams, $state) {
  $scope.goalTypes = User.returnGoals();
  $scope.goalClick = User.goalClick;  
});
