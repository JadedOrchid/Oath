// var authController = require('./authController.js');

module.exports = function(router) {
  router.post('/stripe', function(req, res){

    
    console.log("Here is the req.body: ", req.body);
    console.log("Here is the res: ", res);


    res.send("You posted a token to post / stripe!");
  })
};

// function hasGoal (req, res) {
//   var user = req.userData;
//   if (user.goals.length) 
//     goalHandler(req, res);
//   makeGoalHandler(req, res);
// }