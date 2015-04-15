// var authController = require('./authController.js');
var auth = require('../config/auth.js');
var stripe = require("stripe")(auth.stripeAuth.testSecretKey);


module.exports = function(router) {
  router.post("/stripe", function(req, res){
    console.log("This is the request: ", req.body);
    var token = req.body.JSONtoken;
    var cost = req.body.choices.success.stripePrice;
    var orgName = req.body.choices.success.orgName;
    var fail = req.body.choices.fail.clickAction;

    var charge = stripe.charges.create({
      amount: cost,
      currency: "usd",
      source: token,
      description: "Sympact donation to: " + orgName + "or, in case of failure, money to " + fail
    }, function(err, charge){
      if(err){
        console.log("ERROR: ", err.raw);
      }
    });
  })
};
