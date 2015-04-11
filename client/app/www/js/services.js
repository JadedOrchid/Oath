angular.module('starter.factories', [])
.factory('Payment', ['$http', function($http){
  var payment = {};

  payment.sendToken = function(token){

    var JSONtoken = JSON.stringify(token);
    console.log("you are sending token now! let's see what happens, here is the token", JSONtoken);
    $http.post('/payments/stripe', {JSONtoken: JSONtoken})
      .success(function(data, status, headers, config) {
        console.log('You were able to send payment token to server!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your token was not added to server');
      });  
  };
  return payment;
}])

.factory('User', ['$http', '$state', function($http, $state) {
  var user = {};
  user.loggedIn = {
    goals: []
  };

  user.getUncelebrated = function(goals) {
    return goals.map(function(goal){
      if(goal.completed && !goal.celebrated) {
        return goal;
      }
    });
  };

  user.initialDirect = function(currentUser){
    var uncelebrated = user.getUncelebrated(currentUser.goals);
    if (currentUser.goals.length === 0){
      $state.go('goaltype');
      return;
    }
    if(uncelebrated[0]) {
      return user.celebrate(uncelebrated[0]);
    } 
    $state.go('progress');
  };

  user.celebrate = function(goal) {
    goal.celebrated = true;
    user.putGoal(goal);
    if(+goal.target - +goal.progress > 0) {
      $state.go('tab-success');
    } else {
      $state.go('tab-failure');
    }
  };

  user.putGoal = function(goal) {
    //send goal to server put request to /api/goal/:startTime to goal

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

  // user.checkUserStatus = function(){
  //   var goals = user.loggedIn.recentGoals;
  //   var recent = goals[goals.length-1];

  //   if(recent){
  //     if(user.checkCompletedStatus(recent)){
  //       $state.go('tab-success');
  //     } else if (!!user.checkCompletedStatus(recent)) {
  //       $state.go('tab-failure');
  //     }
  //   }
  // };

  // user.checkCompletedStatus = function(goal){
  //   if(user.checkCompletedGoal(goal) && user.checkCompletedTime(goal)){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // user.checkCompletedGoal = function(goal){
  //   var target = goal.target;
  //   var actual = goal.progress;

  //   return actual >= target ? true : false;
  // };

  // user.checkCompletedTime = function(goal){
  //   return goal.timeRemaining <= 0 ? true : false;
  // };

  user.checkJawbone = function(){
    if (user.loggedIn.jawbone === undefined){
      return false;
    } else {
      return true;
    }
  };

  return user;
}])

.factory('GoalBuilder', ['$state', 'User', '$http', function($state, User, $http) {
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
    var goal = goalBuilder.goal;
    goal.fail = fail;
    goal.startTime = Date.now();

    goalBuilder.saveGoal(goal);
    goalBuilder.sendGoal(goal);

    if(User.loggedIn.hasPayment){
      $state.go('progress');
    } else {
      $state.go('payment');
    }
  };

  //UTILS
  goalBuilder.saveGoal = function(goal) {
    var copy = angular.copy(goal);
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
    goalBuilder.goal = {
      completed: false,
      celebrated: false
    };
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

  goalBuilder.updateDeets = function() {
    goalBuilder.goal.period = {
      human: this.timeframe,
      millis: goalBuilder.convertTime(this.timeframe)
    }
    goalBuilder.goal.target = this.target;
    $state.go('goalsuccess');
  };

  return goalBuilder;
}]);
