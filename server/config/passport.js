// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var JawboneStrategy = require('passport-oauth').OAuth2Strategy;
var StravaStrategy = require('passport-strava').Strategy;
var User = require('../models/user');
var configAuth = require('./auth'); 

module.exports = function(passport) {
  ////////////////////////////
  // PASSPORT SESSION SETUP //
  ////////////////////////////
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  ///////////////////////
  // LOCAL LOGIN       //
  ///////////////////////
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, email, password, done) {
    // asynchronous
    process.nextTick(function() {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);
        // if no user is found, return the message
        if (!user)
          return done(null, false); // no user found
        if (!user.validPassword(password))
          return done(null, false); // wrong password
        // all is well, return user
        else
          return done(null, user);
      });
    });
    }));
  ///////////////////////
  // LOCAL SIGNUP      //
  ///////////////////////
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, email, password, done) {
    // asynchronous
    process.nextTick(function() {
      //  Whether we're signing up or connecting an account, we'll need
      //  to know if the email address is in use.
      User.findOne({'local.email': email}, function(err, existingUser) {

        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if there's already a user with that email
        if (existingUser) 
          return done(null, false); // email already taken

        //  If we're logged in, we're connecting a new local account.
        if(req.user) {
          var user = req.user;
          user.local.email  = email;
          user.local.password = user.generateHash(password);
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } 
        //  We're not logged in, so we're creating a brand new user.
        else {
          // create the user
          var newUser = new User();
          newUser.local.email  = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser);
          });
        }
      });
    });
  }));
  ///////////////////////
  // FACEBOOK STRATEGY //
  ///////////////////////
  passport.use(new FacebookStrategy({
    clientID    : configAuth.facebookAuth.clientID,
    clientSecret  : configAuth.facebookAuth.clientSecret,
    callbackURL   : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, token, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {
      // check if the user is already logged in
      if (!req.user) {
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = profile.emails[0].value;
              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }
            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser = new User();

            newUser.facebook.id  = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session
        user.facebook.id  = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;

        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });

      }
    });

  }));

///////////////////////
// JAWBONE STRATEGY  //
///////////////////////
  passport.use('jawbone', new JawboneStrategy({
    clientID    : configAuth.jawboneAuth.clientID,
    clientSecret  : configAuth.jawboneAuth.clientSecret,
    callbackURL   : configAuth.jawboneAuth.callbackURL,
    authorizationURL: configAuth.jawboneAuth.authorizationURL,
    tokenURL    : configAuth.jawboneAuth.tokenURL,
    passReqToCallback : true 
  },    
  function(req, token, refreshToken, profile, done) {  
    var options = {
    'client_id' : configAuth.jawboneAuth.clientID,
    'client_secret' : configAuth.jawboneAuth.clientSecret,
    'access_token' : token}
    up = require('jawbone-up')(options);
    
    // get jawbone profile info
    up.me.get({}, function(err, body) {
      up_me = JSON.parse(body);
      var user = req.user; 
      user.jawbone.id  = up_me.data.xid;
      user.jawbone.token = token;
      user.jawbone.name  = up_me.data.first + ' ' + up_me.data.last;

      user.save(function (err, user) {
      if (err) return console.error(err);
      return done(null, user);
      });

    });
  }));

///////////////////////
// STRAVA STRATEGY   //
///////////////////////
   passport.use(new StravaStrategy({
    clientID: configAuth.stravaAuth.clientID,
    clientSecret: configAuth.stravaAuth.clientSecret,
    callbackURL: configAuth.stravaAuth.callbackURL,
    passReqToCallback : true 
    },
    function(req, token, refreshToken, profile, done) {
    var user = req.user;
    user.strava = {};
    user.strava.id  = profile._json.id;
    user.strava.token = token;
    user.strava.email = profile._json.email;
    user.strava.name  = profile.displayName;

    user.save(function (err, user) {
      if (err) return console.error(err);
      return done(null, user);
    });;
    }
  ));
};
