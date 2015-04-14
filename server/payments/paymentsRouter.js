// var authController = require('./authController.js');
var auth = require('../config/auth.js');
var stripe = require("stripe")(auth.stripeAuth.testSecretKey);


module.exports = function(router) {
  router.post("/stripe", function(req, res){
    var token = req.body.JSONtoken;
    var cost = req.body.choices.success.stripePrice;
    var orgName = req.body.choices.success.orgName;

    var charge = stripe.charges.create({
      amount: cost,
      currency: "usd",
      source: token,
      description: orgName
    }, function(err, charge){
      if(err){
        console.log("ERROR: ", err.raw);
      }
    });
  })
};
