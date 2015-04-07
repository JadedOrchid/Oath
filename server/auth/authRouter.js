// var authController = require('./authController.js');

module.exports = function(app, passport) {

  app.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
  app.get('/facebook/callback',
      passport.authenticate('facebook'), function(req,res){
        res.json(req.user);
      });

  app.get('/jawbone', passport.authenticate('jawbone', { scope : ['basic_read','extended_read','friends_read','move_read','sleep_read','meal_read','mood_write'] }));
  app.get('/jawbone/callback',
      passport.authenticate('jawbone', {
          successRedirect : '/profile',
          failureRedirect : '/auth'
      }));

};