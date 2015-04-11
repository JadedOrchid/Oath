angular.module('starter.controllers', [])

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

.controller('PaymentCtrl', ['$scope', 'Payment', function($scope, Payment) {
  
  $scope.pay = function() {
    var cardholder = {
      number: this.card,
      cvc: this.cvc,
      exp_month: this.month,
      exp_year: this.year
    }

    console.log(cardholder);

    var stripeResponseHandler = function (status, response) {

      if (response.error) {
        // Show the errors on the form
        console.log("There was some sort of error, yo");
      } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        console.log("token", token);
        Payment.sendToken(token);
      }
    }

    Stripe.card.createToken(cardholder, stripeResponseHandler);
    //grab data from all of the input fields

    //call stripe function with form data that returns token
    //send ajax request to auth/stripe with token
    //redirect to progress
    // $state.go('progress');
  };
}])  

.controller('ProgressCtrl', ['$scope', 'User', 'GoalBuilder', function($scope, User, GoalBuilder) {
  $scope.goals = User.loggedIn.goals;
}]);

.controller('FailureReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.failed = User.getOldestUncelebrated();
}])

.controller('SuccessReportCtrl', ['$scope', 'GoalBuilder', 'User', function($scope, GoalBuilder, User) {
  $scope.achieved = User.getOldestUncelebrated();
}])