var nconf = require('nconf');

nconf.file('settings.json'); //add secret file
nconf.env(); //use env variables if no file found

module.exports = {

    'facebookAuth' : {
        'clientID'      : nconf.get('facebookKey'),
        'clientSecret'  : nconf.get('facebookSecret'),
        'callbackURL'   : nconf.get('facebookCallback')
    },
    'twitterAuth' : {
        'consumerKey'       : nconf.get('twitterKey'),
        'consumerSecret'    : nconf.get('twitterSecret'),
        'callbackURL'       : nconf.get('twitterCallback')
    },
    'jawboneAuth' : {
       'clientID'         :  nconf.get('jawboneKey'),
       'clientSecret'     :  nconf.get('jawboneSecret'),
       'authorizationURL' : 'https://jawbone.com/auth/oauth2/auth',
       'tokenURL'         : 'https://jawbone.com/auth/oauth2/token',
       'callbackURL'      : nconf.get('jawboneCallback')
    },
    'stravaAuth' : {
      'clientID'         :  nconf.get('stravaKey'),
      'clientSecret'     :  nconf.get('stravaSecret'),
      'callbackURL'      : nconf.get('stravaCallback')
    },
    'stripeAuth' : {
      'testSecretKey'     :  nconf.get('stripeTestSecretKey')
    }
};