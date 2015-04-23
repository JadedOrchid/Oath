angular.module('oath.goalCtrls', [])

.controller('GoalCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = function(type){
    if( !(type.title === 'Step' || type.title === 'Sleep') ) {
      $state.go('comingsoon');
    } else {
      GoalBuilder.goal.goalType = type;
      if (User.checkJawbone()){
        $state.go('goaldetails');
      } else {
        $state.go('deviceAuth');
      }
    }
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
    GoalBuilder.goal.target = $scope.target;
    GoalBuilder.goal.progress = 0;
    $state.go('goalsuccess');
  }; 

  $scope.selected = function(selectedTimeframe){
    $scope.days = GoalBuilder.getDays(selectedTimeframe);
  };
}]);
