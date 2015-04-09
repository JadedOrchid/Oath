angular.module('starter.controllers', [])

.controller('GoalCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
}])

.controller('GoalSuccessCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = GoalBuilder.successClick;
}])

.controller('PurgController', ['User', function(User) {
  User.getUser();
}])

.controller('GoalFailureCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.failures = GoalBuilder.returnFailures();
  $scope.failClick = GoalBuilder.failClick;
}])

.controller('GoalDetailCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goalType = GoalBuilder.goal.goalType;
  $scope.times = GoalBuilder.returnTimes();
  $scope.updateDeets = GoalBuilder.updateDeets;
}])

.controller('PaymentCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.pay = function() {
    //call stripe function with form data that returns token
    //send ajax request to auth/stripe with token
    //redirect to progress
    $state.go('progress');
  };
}])  

.controller('ProgressCtrl', ['$scope', 'User', 'GoalBuilder', function($scope, User, GoalBuilder) {
  $scope.currentGoals = GoalBuilder.calcRemaining(User.loggedIn.currentGoals);
  $scope.expiredGoals = User.loggedIn.expiredGoals;
}]);