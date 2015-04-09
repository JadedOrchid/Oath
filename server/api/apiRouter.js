var controller = require('./apiController');
module.exports = function(router, passport) {
  router.get('/user', controller.isLoggedIn, controller.handleLoginGet);
  router.post('/goals', controller.isLoggedIn, controller.handleGoalPost);
};
