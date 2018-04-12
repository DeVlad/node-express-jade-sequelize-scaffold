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

    // Return 404 on missing pages
    app.get('*', function (req, res) {
        res.status(404).send('Error: 404. Page not found !');
    });
};
