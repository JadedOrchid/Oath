var passport = require('passport');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

module.exports = function(app,express) {

  var authRouter = express.Router();
  var apiRouter = express.Router();

  require('../config/passport')(passport); // pass passport for configuration

  // log every request to the console
  app.use(morgan('dev'));
  // read cookies (for auth)
  app.use(cookieParser());
  // pull information from html in POST
  app.use(bodyParser.urlencoded({ extended: false }));  
  app.use(bodyParser.json());
  app.use(session({ secret: 'cupcake-of-condescension', resave: false, saveUninitialized: false })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  app.use(express.static(__dirname + '/../../client/app/www'));

  //CORS headers
  // app.all('*', function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  //   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  //   res.header("Access-Control-Allow-Credentials", "true");

  //   next();
  // });

  app.use('/auth', authRouter);
  app.use('/api', apiRouter);

  require('../auth/authRouter.js')(authRouter, passport);
  require('../api/apiRouter.js')(apiRouter, passport);
}
