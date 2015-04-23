angular.module('oath.tabCtrl', [])


.controller('TabCtrl', ['$scope', '$state', function($scope, $state){
  $scope.progressClick = function(){
    $state.go('progress');
  };

  $scope.newGoalClick = function(){
    $state.go('goaltype');
  };

  $scope.settingsClick = function(){
    $state.go('settings');
  };
}])

.directive('navs', function(){
  return {
    templateUrl: '../templates/tabs.html'
  };
});
