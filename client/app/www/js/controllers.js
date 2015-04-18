angular.module('starter.controllers', [])

.controller('SessionCtrl', ['$scope', 'Auth', '$state', 'User', function($scope, Auth, $state, User) {
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
}])

.directive('navs', function(){
  return {
    templateUrl: '../templates/tabs2.html'
  };
})

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

.controller('GoalCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
}])

.controller('GoalDetailCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
    if (!GoalBuilder.goal.goalType){
      $state.go('login');
      return;
    }

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

.controller('GoalSuccessCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
   if (!GoalBuilder.goal.target === undefined){
    $state.go('login');
    return;
   }

  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = GoalBuilder.successClick;
}])

.controller('GoalFailureCtrl', ['$scope', '$state', 'GoalBuilder', function($scope, $state, GoalBuilder) {
  if (!GoalBuilder.goal.success){
    $state.go('login');
    return;
  }

  $scope.failures = GoalBuilder.returnFailures();
  $scope.failClick = GoalBuilder.failClick;
}])



.controller('PaymentCtrl', ['$scope', 'Payment', '$state', 'User', 'GoalBuilder', function($scope, Payment, $state, User, GoalBuilder) {
  if (!GoalBuilder.goal.period){
    $state.go('login');
    return;
  }

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

  var goals = User.loggedIn.goals.filter(function(goal){
    return !goal.celebrated;
  }).reverse();
  
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

.controller('FailureReportCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  // make sure user didn't visit this page from browser
  if (!User.endGoal){
    $state.go('login');
    return;
  }
  User.endGoal = false;
  $scope.achieved = User.getOldestUncelebrated();
  $scope.achieved.celebrated = true;
  User.putGoal( $scope.achieved );
}])

.controller('SuccessReportCtrl', ['$scope', '$state', 'GoalBuilder', 'User', function($scope, $state, GoalBuilder, User) {
  if (!User.endGoal) {
    $state.go('login');
    return;
  }
  User.endGoal = false;
  $scope.achieved = User.getOldestUncelebrated();
  $scope.achieved.celebrated = true;
  User.putGoal( $scope.achieved );
}]);