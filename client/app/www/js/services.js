angular.module('starter.factories', [])

.factory('User', ['$http', '$state', function($http, $state) {
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
    //recent goals
    //completed goals
  };

  //fix later to only save most pertinent data
    //also to standardize the 'username' concern b/c they're different based on
    //how they logged in
  user.getUser = function(){
    return $http.get('/api/user')
      .then(function(userData){
        user.loggedIn = userData.data;
        user.initialDirect(user.loggedIn);
      });
  };

  user.initialDirect = function(currentUser){
    // if(currentUser.recentGoals.length > 0){
    //   user.checkUserStatus();
    // } else
    if (currentUser.currentGoals === undefined || currentUser.currentGoals.length === 0){
      $state.go('goaltype');
    } else {
      $state.go('progress');
    }
  }

  user.checkUserStatus = function(){
    var goals = user.loggedIn.recentGoals;
    var recent = goals[goals.length-1];

    if(recent){
      if(user.checkCompletedStatus(recent)){
        $state.go('tab-success');
      } else if (!!user.checkCompletedStatus(recent)) {
        $state.go('tab-failure');
      }
    }
  };

  user.checkCompletedStatus = function(goal){
    if(user.checkCompletedGoal(goal) && user.checkCompletedTime(goal)){
      return true;
    } else {
      return false;
    }
  };

  user.checkCompletedGoal = function(goal){
    var target = goal.unitInput;
    var actual = goal.progress;

    return actual >= target ? true : false;
  };

  user.checkCompletedTime = function(goal){
    return goal.timeRemaining <= 0 ? true : false;
  };

  user.checkJawbone = function(){
    if (user.loggedIn .jawbone === undefined){
      return false;
    } else {
      return true;
    }
  };

  //function that checks goalstatus - called as soon as userobj is received
    //redirect to goal celeration
    //else goal failure page

  return user;
}])

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

    if (User.checkJawbone()){
      $state.go('goaldetails');
    } else {
      $state.go('deviceAuth');
    }
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
    console.log(User);
    User.loggedIn.currentGoals.push(goalBuilder.goal);

    $http.post('/api/goals', goalBuilder.goal)
      .success(function(data, status, headers, config) {
        console.log('YAY!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your goal could not be added');
      });
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

