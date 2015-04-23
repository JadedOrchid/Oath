angular.module('oath.paymentFactory', [])

.factory('Payment', ['$http', function($http){
  var payment = {};

  payment.sendToken = function(token){
    $http.post('/payments/stripe', {JSONtoken: token, choices: payment.stripeInfo})
      .success(function(data, status, headers, config) {
        console.log('You were able to send payment token to server!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your token was not added to server');
      });
  };
  return payment;
}]);
