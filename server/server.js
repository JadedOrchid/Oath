var express = require('express');
var mongoose = require('mongoose');

var app = express();

// configure and connect to MongoDB
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require ('./config/middleware.js')(app,express);

// required by index.js
module.exports = app;
