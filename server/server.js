var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

// log every request to the console
app.use(morgan('dev'));
// read cookies (for auth)
app.use(cookieParser());
// pull information from html in POST
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'cupcake-of-condescension', resave: false, saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// app.use(express.static('../client/www'));

// routes ======================================================================
require('./routes.js')(app, passport); 

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
