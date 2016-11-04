/**
 * Created by tonim on 14/10/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./auth');


router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    console.log(name);
    console.log(email);
    console.log(username);
    console.log(password);

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
       console.log('faltan campos')
    } else {
        var newUser = new User({
            name: name,
            email:email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        console.log('Usuario Creado');

        res.redirect('/#/login');
    }

});

//Local Strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

//Twitter strategy
passport.use(new TwitterStrategy({
    consumerKey		 : config.twitter.key,
    consumerSecret	: config.twitter.secret,
    callbackURL		 : config.twitter.callback
}, function(accessToken, refreshToken, profile, done) {

    User.findOne({provider_id: profile.id}, function(err, user) {
        if(err) throw(err);

        if(!err && user!= null) return done(null, user);


        var usertweet = new User({
            provider_id	: profile.id,
            name				 : profile.displayName,
            photo				: profile.photos[0].value
        });

        usertweet.save(function(err) {
            if(err) throw err;
            done(null, user);
        });
    });
}));

//Facebook strategy
passport.use(new FacebookStrategy({
    clientID			: config.facebook.key,
    clientSecret	: config.facebook.secret,
    callbackURL	 : config.facebook.callback,
    profileFields : ['id', 'displayName', 'photos']
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({provider_id: profile.id}, function(err, user) {
        if(err) throw(err);
        if(!err && user!= null) return done(null, user);

        // Al igual que antes, si el usuario ya existe lo devuelve
        // y si no, lo crea y salva en la base de datos
        var userface = new User({
            provider_id	: profile.id,
            name				 : profile.displayName,
            photo				: profile.photos[0].value
        });
        userface.save(function(err) {
            if(err) throw err;
            done(null, user);
        });
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/#/profile', failureRedirect:'/#/login',failureFlash: true}),
    function(req, res) {

    });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/#/index');

});


router.get('/twitter', passport.authenticate('twitter'));

router.get('/facebook', passport.authenticate('facebook'));

router.get('/twitter/callback', passport.authenticate('twitter',
    { successRedirect: '/#/profile', failureRedirect: '/#/login' }
));

router.get('/facebook/callback', passport.authenticate('facebook',
    { successRedirect: '/#/profile', failureRedirect: '/#/login' }
));

module.exports = router;
