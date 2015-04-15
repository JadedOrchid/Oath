var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var jawbone = require('../lib/jawbone');

module.exports = function(app,express) {

  var authRouter = express.Router();
  var apiRouter = express.Router();
  var paymentsRouter = express.Router();

  require('../config/passport')(passport); // pass passport for configuration

  // log every request to the console
  app.use(morgan('dev'));
  // read cookies (for auth)
  app.use(cookieParser());
  // pull information from html in POST
  app.use(bodyParser.urlencoded({ extended: false }));  
  app.use(bodyParser.json());
  app.use(session({ secret: 'cupcake-of-condescension', resave: true, saveUninitialized: false, cookie: { maxAge: 9600000 } })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  app.use(express.static(__dirname + '/../../client/app/www'));

  app.use('/auth', authRouter);
  app.use('/api', apiRouter);
  app.use('/payments', paymentsRouter);

  require('../auth/authRouter.js')(authRouter, passport);
  require('../api/apiRouter.js')(apiRouter, passport);
  require('../payments/paymentsRouter.js')(paymentsRouter);

  require('../lib/scheduler'); // begin cron job
};
