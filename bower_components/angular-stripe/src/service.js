'use strict';

var angular = require('angular');
var Stripe  = require('stripe');

module.exports = function ($q) {

  function promisify (receiver, method) {
    return function (data, params) {
      if (typeof params === 'function') {
        throw new Error('"params" cannot be a function');
      }
      return $q(function (resolve, reject) {
        receiver[method](data, params, function (status, response) {
          if (response.error) {
            return reject(angular.extend(new Error(), response.error));
          }
          else {
            return resolve(response);
          }
        });
      });
    };
  }

  function wrap (source, options) {
    var angularStripe = {
      setPublishableKey: Stripe.setPublishableKey
    };
    angular.forEach(options, function (methods, receiver) {
      var destination = angularStripe[receiver] = {};
      receiver = Stripe[receiver];
      angular.forEach(methods.promisify, function (method) {
        destination[method] = promisify(receiver, method);
      });
      angular.forEach(methods.reference, function (method) {
        destination[method] = receiver[method];
      });
    });
    return angularStripe;
  }

  return wrap(Stripe, {
    card: {
      reference: ['validateCardNumber', 'validateExpiry', 'validateCVC', 'cardType'],
      promisify: ['createToken']
    },
    bankAccount: {
      reference: ['validateRoutingNumber', 'validateAccountNumber'],
      promisify: ['createToken']
    }
  });
};

module.exports.$inject = ['$q'];
