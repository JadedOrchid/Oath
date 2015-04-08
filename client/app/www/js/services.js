angular.module('starter.factories', [])

.factory('User', function() {
  var user = {};
  user.loggedIn = {
    currentGoals: [
      {
        goalType: {
          title: 'step'
      },
        timeRemaining: '1second'
      }
    ]
  };

  //function that checks goalstatus - called as soon as userobj is received
    //redirect to goal celeration or goal failure page
    //else goaltype
    //else progress

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

  //THE GOAL
  goalBuilder.goal = {
    progress: 0
  };

  //DATA
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
  };
  
  goalBuilder.returnTimes = function(){
    var times = [
      "One Day",
      "One Week",
      "One Month",
      "One Year"
    ];
    return times;
  };
  
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
  };

  goalBuilder.convertTime = function(timeframe) {
    var millis = {
      'One Day': 86400000,
      'One Week': 604800000,
      'One Month': 2419200000,
      'One Year': 3.15569e10
    }
    return millis[timeframe];
  };
  
  //CLICK THROUGH GOAL SETUP
  goalBuilder.goalClick = function(goal){
    goalBuilder.goal.goalType = goal;
    $state.go('goaldetails');
  };

  goalBuilder.successClick = function(success){
    goalBuilder.goal.success = success;
    $state.go('goalfailure');
  };

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

  //UTILS
  goalBuilder.sendGoal = function(){
    // $http.post('/api/goal', goalBuilder.goal)
    //   .success(function(data, status, headers, config) {
    //   })
    //   .error(function(data, status, headers, config) {
    //     console.log('Your goal could not be added');
    //   });
    User.loggedIn.currentGoals.push(goalBuilder.goal);
  };

  goalBuilder.calcRemaining = function(list) {
    // var remaining;
    // var now = Date.now();
    // for(var i = 0; i < list.length; i++) {
    //   goal = list[i];
    //   remaining = goal.period.millis - (now - goal.startTime);
    //   goal.timeRemaining = remaining;
    // }
    return list;
  };


  goalBuilder.updateDeets = function() {
    goalBuilder.goal.period = {
      human: this.timeframe,
      millis: goalBuilder.convertTime(this.timeframe)
    }
    goalBuilder.goal.unitInput = this.unitInput;
    $state.go('goalsuccess');
  };

  return goalBuilder;
});

