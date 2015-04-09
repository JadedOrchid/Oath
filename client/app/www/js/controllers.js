angular.module('starter.controllers', [])

.controller('AuthCtrl', function($scope, AuthFactory, $stateParams, $state) {
  $scope.fb = AuthFactory.facebook;
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

.controller('GoalDetailCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.goalType = GoalBuilder.goal.goalType;
  $scope.times = GoalBuilder.returnTimes();
  $scope.updateDeets = GoalBuilder.updateDeets;
})

.controller('PaymentCtrl', function($scope, $state) {
  $scope.pay = function() {
    //call stripe function with form data that returns token
    //send ajax request to auth/stripe with token
    //redirect to progress
    $state.go('progress');
  };
})  

.controller('ProgressCtrl', function($scope, $state, User, GoalBuilder) {
  $scope.currentGoals = GoalBuilder.calcRemaining(User.loggedIn.currentGoals);
  $scope.expiredGoals = User.loggedIn.expiredGoals;
})

.controller('TestCtrl', function($scope, GoalBuilder, $stateParams, $state) {
  $scope.test = 'Testing';
  $scope.testFunc = function(){
    return true;
  };
});