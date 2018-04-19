var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');

// App config
var config = require('./config/config');

// Passport Auth
require('./config/passport')(passport);
// Required for passport
app.use(session({
    secret: 'VerySecret.ChangeInProduction!',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());

// Persistent login sessions
app.use(passport.session());

// TODO Database

// CDN resources for views
app.locals = ({
    cdn: config.cdn
});

// Read cookies
app.use(cookieParser());

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
