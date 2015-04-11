// var authController = require('./authController.js');
var stripe = require('stripe')('sk_test_twv1oUzJ57KxofaPhYLor1Yw');


module.exports = function(router) {
  router.post('/stripe', function(req, res){
    var token = req.body.JSONtoken;
    console.log(token)

    var charge = stripe.charges.create({
      amount: 1000,
      currency: 'usd',
      source: token,
      description: 'You bought a tree!'
    }, function(err, charge){
      if(err && err.type === 'StripeCardError'){
        console.log('This card has been declined.');
      }
    });
    console.log("Here's the charge: ", charge);
  })
};