var mongoose = require('mongoose');

// define the schema for our user model
var pubsubSchema = mongoose.Schema({
   data : {}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('PubSub', pubsubSchema);