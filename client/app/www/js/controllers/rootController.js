angular.module('oath.rootCtrl', [])
.controller('RootCtrl', ['$scope', '$state', 'User', 'GoalBuilder', function($scope, $state, User, GoalBuilder) {
  User.getUser().then(function(user){
    User.loggedIn = user;
    redirect(user);
  }).catch(function(err){
    $state.go('login');
  });

  function redirect (user){
    var authorizedGoal = localStorage.getItem('goalType');
    if(authorizedGoal) {
      GoalBuilder.goal.goalType = JSON.parse(authorizedGoal);
      localStorage.removeItem('goalType');
      var status = User.hasValidDevice(GoalBuilder.goal.goalType.title);
      if (status){
        $state.go('goaldetails');
        return;
      } else {
        $state.go('deviceAuth');
        return;
      }

    }
    var uncelebratedGoal = User.getOldestUncelebrated();
    if (user.goals.length === 0){
      $state.go('goaltype');
    } else if (uncelebratedGoal) {
      var successful = (+uncelebratedGoal.progress -
                        +uncelebratedGoal.target > 0);
      if (successful) {
        User.endGoal = true;
        $state.go('successreport');
      } else {
        User.endGoal = true;
        $state.go('failurereport');
      }
    } else {
       $state.go('progress');
    }
  }
}]);
