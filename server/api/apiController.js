var User = require('../models/user');

var apiController = {};

apiController.handleGoalPost = function(req,res){
  var newGoal = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {$push: {"goals": newGoal}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    });
};
apiController.handleLoginGet = function(req,res){
  res.json(req.user);
};

apiController.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()){
        next();
    } else{
      res.status(401);
      res.send('not logged in');
    }
  };

module.exports = apiController;
