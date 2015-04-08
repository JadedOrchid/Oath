// var authController = require('./authController.js');
module.exports = function(router, passport) {
  router.get('/user', passport.isLoggedIn,  function(req, res){
    res.json(req.user);
  })
};