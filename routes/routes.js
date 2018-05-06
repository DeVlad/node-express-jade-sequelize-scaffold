var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', { title: 'Project Title', message: 'Heading' })
    });

    app.get('/error', function (req, res) {
        res.render('error', {
            message: req.flash('errorMessage')
        });
    });

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            user: req.user
        });
    });

    app.post('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            user: req.user
        });
    });

    app.get('/about', function (req, res) {
        res.render('about');
    });

    app.get('/contacts', function (req, res) {
        res.render('contacts');
    });

    app.get('/search', function (req, res) {
        res.render('search');
    });

    app.post('/search', function (req, res) {
        res.render('search');
    });

    app.get('/signup', function (req, res) {
        res.render('signup');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/signup', function (req, res) {
        res.render('signup');
    });   

    app.get('/profile/admin', isLoggedIn, isAdmin, function (req, res) {
        res.render('admin', {
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });    

    // Return 404 on missing pages
    app.get('*', function (req, res) {
        res.status(404).send('Error: 404. Page not found !');
    });
};

// Is authenticated policy
// Make sure the user is logged
function isLoggedIn(req, res, next) {    
    if (req.isAuthenticated())
        return next();    
    res.redirect('/');
}

function isAdmin(req, res, next) {
    // User witch id 1 is the admin
    if (req.user.id === 1)
        return next();
    // is not admin redirect to profile
    res.redirect('/profile');
}
