// var authController = require('./authController.js');
var PubSub = require('../models/pubsub');

module.exports = function(app, passport) {
  //authenticate with facebook
  app.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
  app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/#/purgatory', 
    failureRedirect : '/#/login'
  }));

  //authenticate with local strategy
  app.post('/login', passport.authenticate('local-login'), function(req, res){
        res.json(req.user);
      });
  app.post('/signup', passport.authenticate('local-signup'), function(req,res){
        res.json(req.user);
      });

  //connect jawbone
  app.get('/jawbone', passport.authorize('jawbone', { scope : ['basic_read','extended_read','friends_read','move_read','sleep_read','meal_read'] }));
  app.get('/jawbone/callback', passport.authorize('jawbone'), function(req, res){
    res.redirect('/#/purgatory');
  });

  app.post('/jawbone/pubsub', function(req,res){
    var info = req.body;
    
    var pubSub = new PubSub();
    pubSub.data = req.body;
    pubSub.save(function(err) {
              if (err)
                  throw err;
              });
    res.send('success');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.send('logged out');
  });

  app.get('/isLoggedIn', function(req, res) {
    res.send(req.isAuthenticated());
  });
};