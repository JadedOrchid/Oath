var express = require('express'),
    bodyParser     = require('body-parser'),
    app = express();

// pull information from html in POST
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json())

app.use(express.static('../client/www'));

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
