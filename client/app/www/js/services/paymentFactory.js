angular.module('oath.paymentFactory', [])

.factory('Payment', ['$http', function($http){
  var payment = {};

  payment.sendToken = function(token){
    $http.post('/payments/stripe', {JSONtoken: token, choices: payment.stripeInfo})
      .success(function(data, status, headers, config) {
        console.log('payment success');
      })
      .error(function(data, status, headers, config) {
        console.error('payment error');
      });
  };
  return payment;
}]);
