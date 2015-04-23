angular.module('oath.rootCtrl', [])
.controller('RootCtrl', ['$scope', 'Auth', '$state', 'User', function($scope, Auth, $state, User) {
  User.getUser().then(function(user){
    User.loggedIn = user;
    redirect(user);
  }).catch(function(err){
    $state.go('login');
  });

  function redirect (user){
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
