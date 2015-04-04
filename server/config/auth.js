// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '378500992337615', // your App ID
        'clientSecret'  : '3c600885d841e9cc997ad582cba7520e', // your App Secret
        'callbackURL'   : 'http://localhost:5000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'zN0RKYYpArcmQ3qt0BmqQKzJH',
        'consumerSecret'    : 'ZqKe7bB48UVhcJGeIhz8CLWE1es3C9fzEZxOy4a0pI1NtUwH9I',
        'callbackURL'       : 'http://localhost:5000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '192345361091-5dbge8rrdaftmrdgrjvolh50ab5955q2.apps.googleusercontent.com',
        'clientSecret'  : 'AJK8NXXBlCu6LTBg7hM1xkgH',
        'callbackURL'   : 'http://localhost:5000/auth/google/callback'
    },
    'jawboneAuth' : {
       'clientID'     : 'lFDJEcTXR8A', // your App ID
       'clientSecret'     : '31c6d9c45337da30e678e9c450188df3646cdfb4', // your App Secret
       'authorizationURL' : 'https://jawbone.com/auth/oauth2/auth',
       'tokenURL'         : 'https://jawbone.com/auth/oauth2/token',
       'callbackURL'      : 'http://localhost:5000/auth/jawbone/callback'
    }
};
