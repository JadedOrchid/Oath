var https = require('https');

var strava = {};

strava.get = function(type, userToken, cb) {
  return https.get({
      host: 'www.strava.com',
      path: '/api/v3/' + type,
      headers: { 'Authorization' : 'Bearer ' +  userToken }
   }, function(response) {
         var body = '';
         response.on('data', function(d) {
           body += d;
         });
         response.on('end', function() {
           cb(null, body);
         });
   });
};

module.exports = strava;
