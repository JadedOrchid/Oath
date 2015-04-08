angular.module('starter.factories', [])
.factory('User', function() {
  var user = {};
  user.loggedIn = {};

  return user;
})

.factory('AuthFactory', ['$state', '$http', '$q', function($state, $http, $q){
  //post to different endpoints
  var factory = {};

  factory.facebook = function(){
    console.log("You're calling factory.facebook");
    return $http.get('/auth/facebook');
      // .then(function(res){
      //   if (!res.facebook) {
      //           return $state.go('login');
      //         } else {
      //           console.log("Successful facebook login, moving on")
      //           return $state.go('goaltype')
      //         }
      // })
  };

  return factory;
}])

.factory('GoalBuilder', function($state, User, $http) {
  var goalBuilder = {};

  goalBuilder.goal = {};
  goalBuilder.returnGoals = function(){
    var goalTypes = [
      {
        title: "Step Goal",
        unit: "steps"
      },
      {
        title: "Sleep Goal",
        unit: "hours"
      },
      {
        title: "Cycling Distance Goal",
        unit: "miles"
      },
      {
        title: "Cycling Climbing Goal",
        unit: "feet"
      },
      {
        title: "Tech Usage Goal",
        unit: "minutes"
      },
      {
        title: "Running Distance Goal",
        unit: "miles"
      },
      {
        title: "Focus Goal",
        unit: "minutes"
      }
    ];

    return goalTypes;
  };

  goalBuilder.goalClick = function(goal){
    goalBuilder.goal.goalType = goal;
    $state.go('goaldetails');
  };

  goalBuilder.returnSucesses = function(){
    var successTypes = [
      {
        orgName: 'Arbor Day Foundation',
        description: 'Plant a tree!',
        price: '$5',
        img: 'imgurl'
      },
      {
        orgName: 'Red Cross',
        description: 'Buy a vaccination',
        price: '$5',
        img: 'imgurl'
      },
      {
        orgName: 'TerraPass',
        description: 'Offset a flight',
        price: '$5',
        img: 'imgurl'
      }
    ];
    return successTypes;
  }

  goalBuilder.successClick = function(success){
    goalBuilder.goal.success = success;
    $state.go('goalfailure');
  };

  goalBuilder.returnTimes = function(){
    var times = [
      "One Day",
      "One Week",
      "One Month",
      "One Year"
    ];
    return times;
  }

  goalBuilder.returnFailures = function(){
    var failTypes = [
      {
        orgName: 'Tip the developers',
        description: "We're broke",
        img: 'imgurl'
      },
      {
        orgName: 'Cupcake of condesention',
        description: 'Sweets',
        img: 'imgurl'
      }
    ];
    return failTypes;
  }

  goalBuilder.sendGoal = function(){
    $http.post('/api/goal', goalBuilder.goal)
      .success(function(data, status, headers, config) {
        User.loggedIn.goals.push(goalBuilder.goal);
      })
      .error(function(data, status, headers, config) {
        console.log('Your goal could not be added');
      });
  }

  goalBuilder.failClick = function(fail){
    goalBuilder.goal.fail = fail;
    goalBuilder.goal.startTime = Date.now();
    goalBuilder.sendGoal();

    if(User.loggedIn.hasPayment){
      $state.go('progress');
    } else {
      $state.go('payment');
    }
  };

  return goalBuilder;
<<<<<<< HEAD
});
=======
}]);
>>>>>>> Add auth controllers
