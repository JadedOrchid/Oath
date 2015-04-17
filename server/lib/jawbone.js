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

    try{
      body = JSON.parse(body);
    } catch(e) {
      console.error('JSON PARSE ERROR', e)
      cb(e, null);
    }

    cb(err, body);
  });
};

module.exports = jawbone;