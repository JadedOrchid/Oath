var User = require('../models/user');
var lib = require('../lib/utils');

var apiController = {};

// return updated user
apiController.handleUserGet = function(req,res){
  res.send(req.user);
};

// returns updated goals
apiController.handleGoalsGet = function(req,res){
  res.send(req.user.goals);
};


apiController.handleGoalsPost = function(req,res){
  var newGoal = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {$push: {"goals": newGoal}},
    {safe: true, upsert: true},
    function(err, model) {
        res.send('success');
        console.log(err);
    });
};


apiController.handleGoalGet = function(req,res){
  var startTime = req.params.startTime;
    User.findById(req.user._id, function(err, user) {
        var goals = user.goals;
        var goal = null;
        for (var i = 0; i < goals.length; i++){
          // triple equals doesn't work here (?)
          if (goals[i].startTime == startTime){
            goal = goals[i]
          }
        }
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
        for (var i = 0; i < user.goals.length; i++){
          // triple equals doesn't work here (?)
          if (user.goals[i].startTime == startTime){
            oldGoal = user.goals[i];
            user.goals[i] = newGoal;
          }
        }    
        user.markModified('goals');
        user.save(function(err, newGoal){
          if (oldGoal){
            res.send('success');
          } else {
            res.status(404);
            res.send('not found');
          }
        });
    });
};


apiController.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()){
        next();
    } else{
      res.status(401);
      res.send('not logged in');
    }
  };

apiController.stripePost = function(req,res,next){
  res.send("you did it!");
}

module.exports = apiController;
