angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GoalDetailCtrl', function($scope, User, $stateParams, $state){
  $scope.goalType = User.goal.goalType;
})

.controller('GoalCtrl', function($scope, User, $stateParams, $state) {
  $scope.goalTypes = User.returnGoals();
  $scope.goalClick = User.goalClick;  
});
