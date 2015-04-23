angular.module('oath.reportCtrls', [])
.controller('FailureReportCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  // make sure user didn't visit this page from browser
  if (!User.endGoal){
    $state.go('login');
    return;
  }
  User.endGoal = false;
  $scope.achieved = User.getOldestUncelebrated();
  $scope.achieved.celebrated = true;
  User.putGoal( $scope.achieved );
}])

.controller('SuccessReportCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  if (!User.endGoal) {
    $state.go('login');
    return;
  }
  User.endGoal = false;
  $scope.achieved = User.getOldestUncelebrated();
  $scope.achieved.celebrated = true;
  User.putGoal( $scope.achieved );
}]);
