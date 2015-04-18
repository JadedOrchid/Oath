angular.module('starter.controllers', [])

.controller('SessionCtrl', ['$scope', 'Auth', '$state', 'User', function($scope, Auth, $state, User) {
  User.getUser().then(function(user){
    User.loggedIn = user;
    redirect(user);
  }).catch(function(err){
    $state.go('login');
  });

  function redirect (user){
    var uncelebratedGoal = User.getOldestUncelebrated(user.goals);
    if (user.goals.length === 0){
      $state.go('goaltype');
    } else if (uncelebratedGoal) {
      var successful = (+uncelebratedGoal.progress -
                        +uncelebratedGoal.target > 0);
      if (successful) {
        $state.go('successreport');
      } else {
        $state.go('failurereport');
      }
    } else {
       $state.go('progress');
    }
  }
}])

.directive('navs', function(){
  return {
    templateUrl: '../templates/tabs2.html'
  };
})

.controller('TabCtrl', ['$scope', '$state', function($scope, $state){
  $scope.progressClick = function(){
    console.log("You've clicked progress on the TabCtrl");
    $state.go('progress');
  };

  $scope.newGoalClick = function(){
    console.log("You've clicked new goal on the TabCtrl");
    $state.go('goaltype');
  };

  $scope.settingsClick = function(){
    console.log("You've clicked settings on the TabCtrl");
    $state.go('settings');
  };
}])

.controller('GoalCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
}])

.controller('GoalSuccessCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = GoalBuilder.successClick;
}])

.controller('GoalFailureCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.failures = GoalBuilder.returnFailures();
  $scope.failClick = GoalBuilder.failClick;
}])

.controller('GoalDetailCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goal = GoalBuilder.goal;
  $scope.days = 1; // initialize days variable so calcaulation at bottom page doesn't throw error
  $scope.target = GoalBuilder.goal.goalType.suggestedTarget;
  $scope.dailyAverage = $scope.target;
  $scope.times = GoalBuilder.returnTimes(); //contains the available goal timeframes
  $scope.updateDeets = GoalBuilder.updateDeets; //update the details
  $scope.selected = function(selectedTimeframe){
    console.log("This is your selected timeframe!", selectedTimeframe);
    $scope.days = GoalBuilder.getDays(selectedTimeframe);
    // console.log("And this is number of days: ", $scope.days);
  };

}])

.controller('PaymentCtrl', ['$scope', 'Payment', '$state', 'User', 'GoalBuilder', function($scope, Payment, $state, User, GoalBuilder) {
  console.log("This is Payment", Payment);
  var goal = GoalBuilder.goal;

  $scope.goal = goal;
  $scope.goalDuration = goal.period.human.toLowerCase();

  $scope.pay = function() {
    // only save/send goal when pay function is called
    GoalBuilder.saveGoal(goal);
    GoalBuilder.sendGoal(goal);

    var cardholder = {
      number: this.card,
      cvc: this.cvc,
      exp_month: this.month,
      exp_year: this.year
    }

    var stripeResponseHandler = function (status, response) {

      if (response.error) {
        // Show the errors on the form
        console.log("There was some sort of error, yo");
      } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        Payment.sendToken(token);
      }
    }
    //Use the Stripe module to get a token for this user
    //if successful, call our response handler, which defers to server to charge customer
    Stripe.card.createToken(cardholder, stripeResponseHandler);

    $state.go('progress');
  }
}])

.controller('ProgressCtrl', ['$scope', 'User', 'GoalBuilder', 'Auth', function($scope, User, GoalBuilder, Auth) {
  $scope.logout = Auth.logout;

  var goals = User.loggedIn.goals.slice().reverse();
  $scope.goals = goals.map(processGoal);

    // Chart.js Options
   $scope.goalOptions =  {
      responsive: true,
      segmentShowStroke : false,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 60,
      animationSteps : 1,
      animationEasing : 'easeInBounce',
      animateRotate : false,
      animateScale : false,
      legendTemplate : ''
    };

    $scope.timeOptions =  {
      responsive: true,
      segmentShowStroke : false,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 80,
      animationSteps : 1,
      animationEasing : 'easeInBounce',
      animateRotate : false,
      animateScale : false,
      legendTemplate : ''
    };

    function processGoal(goal){
      goal.goalRemaining = Math.max( + goal.target - goal.progress, 0) ;
      goal.graphData = [{
          value: goal.progress,
          color:'#ffc125', // salmon
          // highlight: '#FF5A5E',
          label: ''
        },
        {
          value: goal.goalRemaining,
          color: '#ececec', // grey
          // highlight: '#46BFBD',
          label: ''
        } ];
        var now = Math.floor(Date.now() / 1000);
        goal.timeElapsed =  now - goal.startTime;
        var timeRemaining = goal.period.seconds - goal.timeElapsed;
        goal.timeRemaining = convertTime(timeRemaining);

      goal.timeData = [{
          value: goal.timeElapsed,
          color:'#ececec',
          // highlight: '#28BE9B',
          label: ''
        },
        {
          value: timeRemaining,
          color: '#26b099',
          // highlight: '#5AD3D1',
          label: ''
        } ];

      if (goal.goalType.title !== "Sleep Goal"){
        goal.displayProgress = goal.progress + ' ' + goal.goalType.unit;
      } else {
        goal.displayProgress = convertTime( +goal.progress);
      }
      return goal;
    }

    function convertTime(seconds){
      if (seconds < 60){
        var num = seconds;
        return num + " second" + ((num === 1) ? '' : 's');
      } else if (seconds < 60 * 60) {
        var num = Math.floor(seconds / 60);
        return  num + " minute" + ((num === 1) ? '' : 's');
      } else if (seconds < 60 * 60 * 24 ) {
        var num = Math.floor(seconds / 60 / 60);
        return num + " hour" + ((num === 1) ? '' : 's');
      } else {
        var num = Math.floor(seconds / 60 / 60 / 24);
        return num + " day" + ((num === 1) ? '' : 's');
      }
    };
}])

.controller('FailureReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.failed = User.getOldestUncelebrated(User.loggedIn.goals);
}])

.controller('SuccessReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.success = User.loggedIn.goals[0].success;
  console.log('Success OBJ: ', $scope.success);
  $scope.achieved = function(){
    var uncelebrated = User.getOldestUncelebrated(User.loggedIn.goals);
    uncelebrated.celebrated = true;
    User.putGoal(uncelebrated);
    console.log(uncelebrated)
    return uncelebrated;
  }();
}])
