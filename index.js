var app = require('./server/server.js');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log("Listening at localhost:" + app.get('port'));
});
