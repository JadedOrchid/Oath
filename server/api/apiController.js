var User = require('../models/user');

var apiController = {};

apiController.handleGoalPost = function(req,res){
  console.log('INSIDE GOAL HANDLER', req.user)
  var newGoal = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {$push: {"goals": newGoal}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    });
};

module.exports = apiController;