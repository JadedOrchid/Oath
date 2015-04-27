angular.module('oath.goalCtrls', [])

.controller('GoalCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  //clears localStorage
  localStorage.removeItem('goalType');
  if (!User.loggedIn){
    $state.go('root');
  }

  $scope.goalTypes = GoalBuilder.returnGoals();

  $scope.comingSoon = function(){
    $state.go('comingsoon');
  };

  $scope.goalClick = function(type){
    var status = User.hasValidDevice(type.title);
    if(status === null) {
      $state.go('comingsoon');
    } else if (status){
      GoalBuilder.goal.goalType = type;
      $state.go('goaldetails');
    } else {
      GoalBuilder.goal.goalType = type;
      $state.go('deviceAuth');
    }
  };
  $scope.localSave = function() {
    localStorage.setItem('goalType', JSON.stringify(GoalBuilder.goal.goalType));
  };
}])

.controller('GoalDetailCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
  if (!GoalBuilder.goal.goalType){
    $state.go('login');
    return;
  }

  $scope.goal = GoalBuilder.goal;
  $scope.days = 1; // initialize days variable so calcaulation at bottom page doesn't throw error
  $scope.target = GoalBuilder.goal.goalType.suggestedTarget;
  $scope.dailyAverage = $scope.target;
  $scope.times = GoalBuilder.returnTimes(); //contains the available goal timeframes

  $scope.updateDeets = function(){
    GoalBuilder.goal.period = {
      human: this.timeframe,
      seconds: GoalBuilder.convertTime(this.timeframe)
    };
    GoalBuilder.goal.target = $scope.dailyAverage * $scope.days;
    GoalBuilder.goal.progress = 0;
    $state.go('goalsuccess');
  };

  $scope.selected = function(selectedTimeframe){
    $scope.days = GoalBuilder.getDays(selectedTimeframe);
  };
}]);
