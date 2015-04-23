angular.module('oath.endConditionCtrls', [])
.controller('GoalSuccessCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
   if (!GoalBuilder.goal.target === undefined){
    $state.go('login');
    return;
   }
  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = GoalBuilder.successClick;
}])
.controller('GoalFailureCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
  if (!GoalBuilder.goal.success){
    $state.go('login');
    return;
  }
  $scope.failures = GoalBuilder.returnFailures();
  $scope.failClick = GoalBuilder.failClick;
}]);
