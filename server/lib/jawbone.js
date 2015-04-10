var auth = require('../config/auth.js');
var User = require('../models/user.js');

var jawbone = {};

jawbone.get = function(type, userToken, cb) {
  var options = {
    'client_id' : auth.jawboneAuth.clientID,
    'client_secret' : auth.jawboneAuth.clientSecret,
    'access_token' : userToken 
  };
  console.log(options);
  var up = require('jawbone-up')(options);

  up[type].get({}, function(err, body){
    cb(err, body);
  });
};

module.exports = jawbone;