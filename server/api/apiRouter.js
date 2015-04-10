var controller = require('./apiController');
var jawbone = require('../lib/jawbone');
module.exports = function(router, passport) {
  router.get('/user', controller.isLoggedIn, controller.handleUserGet);

  router.get('/goals', controller.isLoggedIn, controller.handleGoalsGet);

  router.get('/goals/:startTime', controller.isLoggedIn, controller.handleGoalGet);
  router.put('/goals/:startTime', controller.isLoggedIn, controller.handleGoalPut);

  router.post('/goals', controller.isLoggedIn, controller.handleGoalsPost);

  router.get('/getSleeps', controller.isLoggedIn, function(req,res){
    jawbone.get('sleeps', req.user.jawbone.token, function(err, body){
      res.send(body);
    })
  });

  router.get('/getMoves', controller.isLoggedIn, function(req,res){
    jawbone.get('moves', req.user.jawbone.token, function(err, body){
      res.send(body);
    })
  });

};
