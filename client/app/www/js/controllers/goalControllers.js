angular.module('oath.goalCtrls', [])

.controller('GoalCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
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
  $scope.updateDeets = GoalBuilder.updateDeets; //update the details
  $scope.selected = function(selectedTimeframe){
    console.log("This is your selected timeframe!", selectedTimeframe);
    $scope.days = GoalBuilder.getDays(selectedTimeframe);
    // console.log("And this is number of days: ", $scope.days);
  };
}]);
