var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var path = require('path');

// App config
var config = require('./config/config');

// TODO Database

// CDN resources for views
app.locals = ({
    cdn: config.cdn
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Flash messages stored in session
app.use(flash());

// Handle static files
app.use(express.static(__dirname + '/public'));

// Routes
require('./routes/routes.js')(app);

// Error handler
app.use(function (err, req, res, next) {
    // if URIError occurs
    if (err instanceof URIError) {
        err.message = 'Failed to decode param at: ' + req.url;
        err.status = err.statusCode = 400;
        return res.send('Error: ' + err.status + '<br>' + err.message);
    } else {
        // More errors...
    }
});

// Turn off Express header
app.disable('x-powered-by');

app.listen(port, console.log('Web server is listening on port:', port));
