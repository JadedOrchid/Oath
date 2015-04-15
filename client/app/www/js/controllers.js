angular.module('starter.controllers', [])

.controller('LoginCtrl', ['$scope', '$cookies', function($scope, $cookies) {
  // $scope.cookies = $cookies.getAll();
  console.log($cookies.token);
}])

.controller('GoalCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.goalTypes = GoalBuilder.returnGoals();
  $scope.goalClick = GoalBuilder.goalClick;
}])

.controller('GoalSuccessCtrl', ['$scope', 'GoalBuilder', function($scope, GoalBuilder) {
  $scope.successes = GoalBuilder.returnSucesses();
  $scope.successClick = GoalBuilder.successClick;
}])

.controller('PurgController', ['User', function(User) {
  User.getUser();
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

.controller('ProgressCtrl', ['$scope', 'User', 'GoalBuilder', function($scope, User, GoalBuilder) {
  $scope.goals = User.loggedIn.goals;
}])

.controller('FailureReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.failed = User.getOldestUncelebrated(User.loggedIn.goals);
}])

.controller('SuccessReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.achieved = User.getOldestUncelebrated(User.loggedIn.goals);
}])

.directive('chartjsdonut', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {

      function initialize() {
        var doughnutData = [
        {
          value: 300,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Red"
        },
        {
          value: 50,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Green"
        },
        {
          value: 100,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Yellow"
        },
        {
          value: 40,
          color: "#949FB1",
          highlight: "#A8B3C5",
          label: "Grey"
        },
        {
          value: 120,
          color: "#4D5360",
          highlight: "#616774",
          label: "Dark Grey"
        }

      ];
      var ctx = $("#chart-area").get(0).getContext("2d");
      var myNewChart = new Chart(ctx).Doughnut(doughnutData, {responsive : true});
      } // end fn initialize

      if (document.readyState === "complete") {
        console.log('initialize');
        initialize();
      } else {
        console.info('event.addDomListener');
      }
    }
  }
});
