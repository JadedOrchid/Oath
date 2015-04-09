var controller = require('./apiController');
module.exports = function(router, passport) {
  router.get('/user', controller.isLoggedIn, controller.handleUserGet);

  router.get('/goals', controller.isLoggedIn, controller.handleGoalsGet);

  router.get('/goals/:startTime', controller.isLoggedIn, controller.handleGoalGet);
  router.put('/goals/:startTime', controller.isLoggedIn, controller.handleGoalPut);

  router.post('/goals', controller.isLoggedIn, controller.handleGoalsPost);
};
