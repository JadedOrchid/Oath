var https = require('https');
var _ = require('underscore');

module.exports = function(type, userToken, cb) {
  return https.get({
      host: 'www.strava.com',
      path: '/api/v3/activities',
      headers: { 'Authorization' : 'Bearer ' +  userToken }
   }, function(response) {
         var body = '';
         response.on('data', function(d) {
           body += d;
         });
         response.on('end', function() {
          var parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {
            cb(e, null);
          }
          cb(null, filter(type, parsed));
         });
   });
};

function filter (type, array){
  _.filter(array, function(elem){
    return elem.type === type;
  });
}
