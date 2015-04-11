// var authController = require('./authController.js');
var auth = require('../config/auth.js');
var stripe = require("stripe")(auth.stripeAuth.testSecretKey);


module.exports = function(router) {
  router.post("/stripe", function(req, res){
    var token = req.body.JSONtoken;
    console.log(token)

    var charge = stripe.charges.create({
      amount: 1000,
      currency: "usd",
      source: token,
      description: "You bought a tree?"
    }, function(err, charge){
      if(err){
        console.log("ERROR: ", err.raw);
      }
    });
    // console.log("Here's the charge: ", charge);
  })
};