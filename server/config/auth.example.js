// config/auth.js
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'id', // your App ID
        'clientSecret'  : 'secret', // your App Secret
        'callbackURL'   : 'http://localhost:5000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'id',
        'consumerSecret'    : 'secret',
        'callbackURL'       : 'http://localhost:5000/auth/twitter/callback'
    },
    'jawboneAuth' : {
       'clientID'     : 'id', 
       'clientSecret'     : 'secret',
       'authorizationURL' : 'https://jawbone.com/auth/oauth2/auth',
       'tokenURL'         : 'https://jawbone.com/auth/oauth2/token',
       'callbackURL'      : 'http://localhost:5000/auth/jawbone/callback'
    }
};