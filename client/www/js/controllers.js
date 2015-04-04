angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GoalDetailCtrl', function($scope, User, $stateParams, $state){

  $scope.goalType = User.goal.goalType;
  $scope.times = [
    "One Day",
    "One Week",
    "One Month",
    "One Year"
  ];
  $scope.updateGoal = function(){
    User.goal.timeframe = this.timeframe;
    User.goal.unitInput = this.unitInput;
  }

})

.controller('GoalCtrl', function($scope, User, $stateParams, $state) {
  $scope.goalTypes = User.returnGoals();
  $scope.goalClick = User.goalClick;
});
