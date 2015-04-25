angular.module('oath.endConditionCtrls', [])
.controller('GoalSuccessCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
   if (!GoalBuilder.goal.target === undefined){
    $state.go('login');
    return;
   }
  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = function(success){
    GoalBuilder.goal.success = success;
    $state.go('goalfailure');
  };
}])
.controller('GoalFailureCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  if (!GoalBuilder.goal.success){
    $state.go('login');
    return;
  }
  $scope.failures = GoalBuilder.returnFailures();
  $scope.failClick = function(fail){
    var goal = GoalBuilder.goal;
    goal.fail = fail;
    goal.startTime = Math.floor( Date.now() / 1000 );
    goal.completed = false;
    goal.celebrated = false;

    if(User.loggedIn.hasPayment){
      $state.go('progress');
    } else {
      $state.go('payment');
    }
  };
}]);
