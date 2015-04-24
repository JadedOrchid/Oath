angular.module('oath.paymentCtrl', [])
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
}]);
