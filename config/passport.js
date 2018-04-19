// Passport.js Authentication

var express = require('express'),
    app = express()
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

var User = require('../models/user');


module.exports = function (passport) {
    // Serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    // Deserialize the user
    passport.deserializeUser(function (id, done) {
        var accountData;

        var q1 = new Promise(function (resolve, reject) {
            User.getUserById(id, function (err, rows) {
                resolve(rows[0]);
            });
        });        

        Promise.all([q1]).then(function(values) {
            accountData = values[0];            
            done(null, accountData);
        });

    });

    // Sign Up
    passport.use(
        'local-signup',
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // Allows passing the request to callback
            },
            function (req, email, password, done) {
                // Check if login user already exists
                User.getUserByEmail(email, function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {                        
                        return done(null, false, req.flash('signupMessage', 'Username is already taken.'));
                    } else {
                        // If there is no user with that username create the user                    
                        var newUser = {
                            first_name: req.body.firstName,
                            last_name: req.body.lastName,                            
                            email: email,
                            password: bcrypt.hashSync(password, null, null)
                        }

                        User.createUser(newUser, function (err, rows) {
                            if (err) throw err;
                            //console.log("Created new user: ", email);
                        });

                        return done(null, rows.insertId);
                    }
                });
            })
    );

    // Login
    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, email, password, done) {
               
                User.getUserByEmail(email, function (err, rows) {
                    if (err)
                        return done(err);                    
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    // User is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password)) {
                        return done(null, false, req.flash('loginMessage', 'Wrong password !'));
                    }                    
                    // Returns successful user
                    return done(null, rows[0]);
                });
            })
    );
};
