// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'id', 
        'clientSecret'  : 'secret', 
        'callbackURL'   : 'http://localhost:5000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'id',
        'consumerSecret'    : 'secret',
        'callbackURL'       : 'http://localhost:5000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'id',
        'clientSecret'  : 'secret',
        'callbackURL'   : 'http://localhost:5000/auth/google/callback'
    },
    'jawboneAuth' : {
       'clientID'     : 'id', 
       'clientSecret'     : 'secret',
       'authorizationURL' : 'https://jawbone.com/auth/oauth2/auth',
       'tokenURL'         : 'https://jawbone.com/auth/oauth2/token',
       'callbackURL'      : 'http://localhost:5000/auth/jawbone/callback'
    }
};
