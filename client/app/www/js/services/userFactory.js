angular.module('oath.userFactory', [])
.factory('User', ['$http', function($http) {
  var User = {};
  User.loggedIn = null;

  User.getUncelebrated = function(goals) {
    goals || (goals = User.loggedIn.goals);
    return goals.filter(function(goal){
      if(goal.completed && !goal.celebrated) {
        return goal;
      }
    });
  };

  User.getOldestUncelebrated = function(goals) {
    goals || (goals = User.loggedIn.goals);
    var uncelebrated = User.getUncelebrated(goals);
    if (uncelebrated.length > 0){
      return uncelebrated[0];
    } else {
      return null;
    }
  };

  User.putGoal = function(goal) {
    $http.put('/api/goals/' + goal.startTime, goal)
      .success(function(data, status, headers, config) {
        console.log('Load was performed.', data);
      })
      .error(function(data, status, headers, config) {
        console.log('error', data);
      });
  };

  User.getUser = function(){
    return $http.get('/api/user').then(function(res){
      return res.data;
    });
  };

  User.checkJawbone = function(user){
    user || (user = User.loggedIn);
    if (user.jawbone === undefined){
      return false;
    } else {
      return true;
    }
  };
  return User;
}]);
