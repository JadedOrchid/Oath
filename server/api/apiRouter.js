var controller = require('./apiController');
var jawbone = require('../lib/jawbone');
var strava = require('../lib/strava');

module.exports = function(router, passport) {
  router.get('/user', controller.isLoggedIn, controller.handleUserGet);

  router.get('/goals', controller.isLoggedIn, controller.handleGoalsGet);

  router.get('/goals/:startTime', controller.isLoggedIn, controller.handleGoalGet);
  router.put('/goals/:startTime', controller.isLoggedIn, controller.handleGoalPut);

  router.post('/goals', controller.isLoggedIn, controller.handleGoalsPost);

  // the following endpoints are for the purpose of testing API calls //
  router.get('/getSleeps', controller.isLoggedIn, function(req,res){
    jawbone('sleeps', req.user.jawbone.token, function(err, body){
      res.send(body);
    })
  });

  router.get('/getMoves', controller.isLoggedIn, function(req,res){
    jawbone('moves', req.user.jawbone.token, function(err, body){
      res.send(body);
    })
  });

  router.get('/getStrava', controller.isLoggedIn, function(req,res){
    strava('Run', req.user.strava.token, function(err, body){
      res.send(body);
    })
  })

};
