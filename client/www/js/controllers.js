angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GoalDetailCtrl', function($scope, GoalBuilder, $stateParams, $state){

  $scope.goalType = GoalBuilder.goal.goalType;
  $scope.times = GoalBuilder.returnTimes();

  $scope.updateDeets = function(){
    GoalBuilder.goal.timeframe = this.timeframe;
    GoalBuilder.goal.unitInput = this.unitInput;
    $state.go('goalsuccess');
  }
})

.controller('GoalCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
})

.controller('GoalSuccessCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.successes = GoalBuilder.returnSucesses();
});
