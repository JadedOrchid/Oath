angular.module('starter.controllers', [])

.controller('SessionCtrl', ['$scope', 'Auth', '$state', 'User', function($scope, Auth, $state, User) {
  Auth.isLoggedIn().then(function(loggedIn){
    if(loggedIn) {
      User.getUser();
    } else {
      $state.go('login');
    }
  });
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
  $scope.goalType = GoalBuilder.goal.goalType;
  $scope.times = GoalBuilder.returnTimes();
  $scope.updateDeets = GoalBuilder.updateDeets;
}])

.controller('PaymentCtrl', ['$scope', 'Payment', '$state', 'User', function($scope, Payment, $state, User) {
  console.log("This is Payment", Payment);
  $scope.goal = Payment.stripeInfo;
  $scope.goalDuration = Payment.stripeInfo.period.human.toLowerCase();
  $scope.pay = function() {
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

  var goals = User.loggedIn.goals;
  // extract data from goals
  $scope.data = goals.map(function(goal){
    var datum = {};

    datum.goal = goal;
    datum.graphData = [{
        value: + goal.target - goal.progress,
        color:'#F7464A',
        highlight: '#FF5A5E',
        label: 'Red'
      },
      {
        value: goal.progress,
        color: '#46BFBD',
        highlight: '#5AD3D1',
        label: 'Green'
      } ];

    return datum;
  });

    // Chart.js Options
   $scope.options =  {

      // // Sets the chart to be responsive
      // responsive: true,

      // //Boolean - Whether we should show a stroke on each segment
      // segmentShowStroke : true,

      // //String - The colour of each segment stroke
      // segmentStrokeColor : '#fff',

      // //Number - The width of each segment stroke
      // segmentStrokeWidth : 2,

      // //Number - The percentage of the chart that we cut out of the middle
      // percentageInnerCutout : 50, // This is 0 for Pie charts

      // //Number - Amount of animation steps
      // animationSteps : 100,

      // //String - Animation easing effect
      // animationEasing : 'easeOutBounce',

      // //Boolean - Whether we animate the rotation of the Doughnut
      // animateRotate : true,

      // //Boolean - Whether we animate scaling the Doughnut from the centre
      // animateScale : false,

      // //String - A legend template
      // legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
    };
}])

.controller('FailureReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.failed = User.getOldestUncelebrated(User.loggedIn.goals);
}])

.controller('SuccessReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.achieved = User.getOldestUncelebrated(User.loggedIn.goals);
}])
