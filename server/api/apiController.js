var User = require('../models/user');

var apiController = {};

apiController.handleGoalsPost = function(req,res){
  var newGoal = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {$push: {"goals": newGoal}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    });
};

apiController.handleGoalsGet = function(req,res){

  User.findById(req.user._id, function(err, user) {
        res.send(user.currentGoals);
    });
};

apiController.handleGoalGet = function(req,res){
  var startTime = req.params.startTime;
    User.findById(req.user._id, function(err, user) {
        var currentGoals = user.currentGoals;
        var goal = null;
        for (var i = 0; i < currentGoals.length; i++){
          // triple equals doesn't work here (?)
          if (currentGoals[i].startTime == startTime){
            goal = currentGoals[i]
          }
        }
        console.log(goal);
        if (goal){
          res.send(goal);
        } else {
          res.status(404);
          res.send('not found');
        }
    });
};
// this method is currently untested
apiController.handleGoalPut = function(req,res){
  var newGoal = req.body;

  var startTime = req.params.startTime;
    User.findById(req.user._id, function(err, user) {
        var oldGoal = null;
        for (var i = 0; i < user.currentGoals.length; i++){
          // triple equals doesn't work here (?)
          if (user.currentGoals[i].startTime == startTime){
            oldGoal = user.currentGoals[i];
            user.currentGoals[i] = newGoal;
          }
        }
        user.save(function(err){
          if (oldGoal){
            res.send(oldGoal); // send back old goal?
          } else {
            res.status(404);
            res.send('not found');
          }
        });
    });
};

apiController.handleUserGet = function(req,res){
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
