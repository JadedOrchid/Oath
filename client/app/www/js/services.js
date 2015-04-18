angular.module('starter.factories', [])

.factory('Payment', ['$http', function($http){
  var payment = {};

  payment.sendToken = function(token){
    console.log("you are sending token now! let's see what happens, here is the token", token);
    $http.post('/payments/stripe', {JSONtoken: token, choices: payment.stripeInfo})
      .success(function(data, status, headers, config) {
        console.log('You were able to send payment token to server!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your token was not added to server');
      });
  };
  return payment;
}])

.factory('User', ['$http', function($http) {
  var user = {};
  user.loggedIn = null;

  user.getUncelebrated = function(goals) {
    return goals.filter(function(goal){
      if(goal.completed && !goal.celebrated) {
        return goal;
      }
    });
  };
  user.getOldestUncelebrated = function(goals) {
    var uncelebrated = user.getUncelebrated(goals);
    console.log('UNCELEBRATED: ', uncelebrated)
    if (uncelebrated.length > 0){
      return uncelebrated[0];
    } else {
      return null;
    }
  };

  user.putGoal = function(goal) {
    $http.put('/api/goals/' + goal.startTime, goal)
      .success(function(data, status, headers, config) {
        console.log('Load was performed.', data);
      })
      .error(function(data, status, headers, config) {
        console.log('error', data);
      });
  };

  user.getUser = function(){
    return $http.get('/api/user').then(function(res){
      return res.data;
    });
  };

  user.checkJawbone = function(user){
    if (user.jawbone === undefined){
      return false;
    } else {
      return true;
    }
  };

  return user;
}])

.factory('Auth', ['User', '$state', '$http', function(User, $state, $http){
  var auth = {};

  auth.isLoggedIn = function() {
    return $http.get('/auth/isLoggedIn').then(function(response) {
      return response.data;
    });
  };

  auth.logout = function() {
    $http.get('/auth/logout').then(function() {
      console.log('logged out');
      $state.go('login');
    });
  }

  return auth;
}])

.factory('GoalBuilder', ['$state', 'User', '$http', 'Payment', function($state, User, $http, Payment) {
  var goalBuilder = {};

  //THE GOAL
  goalBuilder.goal = {
    completed: false,
    celebrated: false
  };

  //DATA
  goalBuilder.returnGoals = function(){
    var goalTypes = [
      {
        title: "Step",
        unit: "steps",
        phase: "day",
        suggestedTarget: 10000,
        iconClass: "ion-android-walk"
      },
      {
        title: "Sleep",
        unit: "hours",
        phase: "night",
        suggestedTarget: 8,
        iconClass: "ion-ios-cloudy-night-outline"
      },
      {
        title: "Cycle",
        unit: "miles",
        phase: "day",
        suggestedTarget: 10,
        iconClass: "ion-android-bicycle"
      },
      {
        title: "Run",
        unit: "miles",
        phase: "day",
        suggestedTarget: 5,
        iconClass: "ion-android-walk"
      },
      {
        title: "Focus",
        unit: "minutes",
        phase: "day",
        suggestedTarget: 240,
        iconClass: "ion-android-radio-button-on"
      },
      {
        title: "Tech",
        unit: "minutes",
        phase: "day",
        suggestedTarget: 240,
        iconClass: "ion-ios-monitor"
      }
    ];

    return goalTypes;
  };

  goalBuilder.returnSucesses = function(){
    //images need to be 760px by 380px
    var successTypes = [
      {
        orgName: 'Doctors Without Borders',
        headline: 'Vaccines - Doctors Without Borders',
        description: 'helps people worldwide where the need is greatest, delivering emergency medical aid to people affected by conflict, epidemics, disasters or exclusion from health care.',
        price: '$5',
        stripePrice: 500,
        img: '../img/msf.jpg',
        clickAction: 'Buy a vaccine'
      },
      {
        orgName: 'The Arbor Day Foundation',
        headline: 'Plant a tree with the Arbor Day Foundation',
        description: 'inspires people to plant, nurture, and celebrate trees.',
        price: '$25',
        stripePrice: 2500,
        img: '../img/arbor.jpg',
        clickAction: 'Buy a tree'
      },
      {
        orgName: 'TerraPass',
        headline: 'Offset a flight with TerraPass',
        description: 'helps create, implement, and operate customer-funded emissions reduction projects at facilities such as dairy farms and landfills.',
        price: '$35',
        stripePrice: 1500,
        img: '../img/carbonoffset.jpg',
        clickAction: 'Offset a flight'
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
        description: "The money you've pledged will go to support the development of Oath. Maybe we'll donate it ourselves, or maybe we'll buy cupcakes. Or go to Vegas.",
        img: '../img/developers.jpg',
        clickAction: 'Tip the developers'
      },
      {
        orgName: 'Consolation Cupcakes',
        description: 'You\'ll need the sugar to support you trying again tomorrow. Shipped from SF, CA.',
        img: '../img/cupcake.jpg',
        clickAction: 'Send the cupcakes'
      }
    ];
    return failTypes;
  };

  //CLICK THROUGH GOAL SETUP
  goalBuilder.goalClick = function(goal){
    goalBuilder.goal.goalType = goal;
    if (User.checkJawbone(User.loggedIn)){
      $state.go('goaldetails');
    } else {
      $state.go('deviceAuth');
    }
  };

  goalBuilder.successClick = function(success){
    goalBuilder.goal.success = success;
    $state.go('goalfailure');
  };

  goalBuilder.getDays = function(timeframe){
    var timeframes = {
      "One Day": 1,
      "One Week": 7,
      "One Month": 30,
      "One Year": 365
    };
    return timeframes[timeframe];

  }

  goalBuilder.failClick = function(fail){
    var goal = goalBuilder.goal;
    goal.fail = fail;
    goal.startTime = Math.floor( Date.now() / 1000 );
    goal.completed = false;
    goal.celebrated = false;

    // goalBuilder.saveGoal(goal);
    // goalBuilder.sendGoal(goal);

    if(User.loggedIn.hasPayment){
      $state.go('progress');
    } else {
      $state.go('payment');
    }
  };

  //UTILS
  goalBuilder.saveGoal = function(goal) {
    var copy = angular.copy(goal);
    //prepend a copy to local goals array
    User.loggedIn.goals.push(copy);
  };

  goalBuilder.sendGoal = function(goal){
    $http.post('/api/goals', goal)
      .success(function(data, status, headers, config) {
        console.log('YAY!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your goal could not be added');
      });
  };

  goalBuilder.convertTime = function(timeframe) {
    var seconds = {
      'One Day': 86400,
      'One Week': 604800,
      'One Month': 2592000,
      'One Year': 3.15569e7
    }
    return seconds[timeframe];
  };

  goalBuilder.updateDeets = function() {
    goalBuilder.goal.period = {
      human: this.timeframe,
      seconds: goalBuilder.convertTime(this.timeframe)
    }
    goalBuilder.goal.target = this.target;
    goalBuilder.goal.progress = 0;
    $state.go('goalsuccess');
  };

  return goalBuilder;
}]);
