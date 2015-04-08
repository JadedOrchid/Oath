// var authController = require('./authController.js');

module.exports = function(app, passport) {
  //authenticate with facebook
  app.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
  app.get('/facebook/callback', passport.authenticate('facebook'), 
    function(req,res){
        res.json(req.user);
      });
  //authenticate with local strategy
  app.post('/login', passport.authenticate('local-login'))
  app.post('/signup', passport.authenticate('local-login'))

  //connect jawbone
  app.get('/jawbone', passport.authorize('jawbone', { scope : ['basic_read','extended_read','friends_read','move_read','sleep_read','meal_read','mood_write'] }));
  app.get('/jawbone/callback', passport.authorize('jawbone'));

};