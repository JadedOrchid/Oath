var controller = require('./apiController');
// var authController = require('./authController.js');
module.exports = function(router, passport) {
  router.get('/user',  function(req, res){
    res.json(req.user);
  });

  router.post('/goals', controller.handleGoalPost);

};

// , passport.isLoggedIn