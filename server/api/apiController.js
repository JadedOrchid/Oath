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
        res.send(user.goals);
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

apiController.stripePost = function(req,res,next){
  res.send("you did it!");
}

module.exports = apiController;
