// var authController = require('./authController.js');
console.log("We are including apiRouter.js");
module.exports = function(router, passport) {
  router.get('/user', passport.isLoggedIn,  function(req, res){
    res.json(req.user);
  })

};