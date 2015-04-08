angular.module('starter.controllers', [])

// .controller('DashCtrl', function($scope) {})

.controller('GoalDetailCtrl', function($scope, GoalBuilder, $stateParams, $state){
  $scope.goalType = GoalBuilder.goal.goalType;
  $scope.times = GoalBuilder.returnTimes();
  $scope.updateDeets = function(){
    GoalBuilder.goal.timeframe = this.timeframe;
    GoalBuilder.goal.unitInput = this.unitInput;
    $state.go('goalsuccess');
  };
})

.controller('GoalCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
})

.controller('GoalSuccessCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = GoalBuilder.successClick;
})

.controller('PurgController', function($scope, User, $stateParams, $state) {
  User.getUser();
})

.controller('GoalFailureCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.failures = GoalBuilder.returnFailures();
  $scope.failClick = GoalBuilder.failClick;
})

.controller('AuthCtrl', function($scope, AuthFactory, $stateParams, $state) {
  $scope.fb = AuthFactory.facebook;
})

.controller('TestCtrl', function($scope, GoalBuilder, $stateParams, $state){
  $scope.test = 'Testing';
  $scope.testFunc = function(){
    return true;
  };
});