var auth = require('../config/auth.js');

var jawbone = {};
jawbone.get = function(type, userToken, cb) {
  var options = {
    'client_id' : auth.jawboneAuth.clientID,
    'client_secret' : auth.jawboneAuth.clientSecret,
    'access_token' : userToken
  };
  var up = require('jawbone-up')(options);
  up[type].get({}, function(err, body){
    cb(err, JSON.parse(body));
  });
};

module.exports = jawbone;