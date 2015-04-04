angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GoalDetailCtrl', function($scope, User, $stateParams, $state){
  $scope.details = {
    selectedItem: null,
    unitInput: null
  };
  // $scope.unitInput;
  $scope.goalType = User.goal.goalType;
  $scope.times = [
    "One Day",
    "One Week",
    "One Month",
    "One Year"
  ];
  $scope.clicked = function(selectedItem, unitInput){
    $scope.details.selectedItem = this.selectedItem;
    $scope.details.unitInput = this.unitInput;
    console.log("This is scope in the function", $scope);
    console.log("This is this: ", this);
  }

})

.controller('GoalCtrl', function($scope, User, $stateParams, $state) {
  $scope.goalTypes = User.returnGoals();
  $scope.goalClick = User.goalClick;  
});
