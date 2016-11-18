/**
 * Created by tonim on 14/10/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/modeluser');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./auth');


router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var description = 'Soy nuevo en Geofinder';
    var photo = 'http://i66.tinypic.com/2yopwmr.jpg';

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
       console.log('faltan campos');
        res.status(400).send(errors);
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            description: description,
            photo: photo
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        res.send('Usuario Registrado');
    }
});

//Local Strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('Estoy aqui' + username + password);
        User.getUserByUsername(username, function(err, user){
            console.log('este el usuario encontrado' + user);
            if(err) throw err;
            if(!user){
                console.log('No encontrado');
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                console.log('he comparado el password');
                console.log('match= ' + isMatch);
                console.log('error= ' + err);
                if(err) throw err;
                if(isMatch){
                    console.log('ok' + user);
                    return done(null, user);
                } else {
                    console.log('contranseña incorrecta');
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
            name				: profile.displayName,
            photo				: profile.photos[0].value,
            username            : profile.id,
            description         : 'Soy nuevo en Geofinder'
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
            photo				: profile.photos[0].value,
            username            :profile.id,
            description         : 'Soy nuevo en Geofinder'
        });
        userface.save(function(err) {
            if(err) throw err;
            done(null, user);
        });
    });
}));


passport.serializeUser(function(user, done) {
    console.log('serializedID abans ' + user.id);
    done(null, user.id);
    console.log('serializedID ' + user.id);

});

passport.deserializeUser(function(id, done) {
    console.log('hola deserialize');
    User.findById(id, function(err, user) {
        console.log('Deserialized User' + user);
        if(!err) done(err, user);
        else done(err, null);

    });
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        console.log('hi my friend');
        res.send(req.user.id);
    });

router.get('/logout', function(req, res){
    req.logout();
    console.log('he hecho logout');
    res.redirect('/#/index');

});

//GEt user by ID
router.get('/my/:user_id', function(req, res){
    User.findById(req.params.user_id).populate('adventures').exec().then(function(err, user){
        if(err)
            res.send(err)
        res.send(user);
    });
});

//Modify the name of a user
router.put('/update/name/:user_id', function(req, res) {
    User.update({_id : req.params.user_id
        },{$set:{name: req.body.name
        }},
        function(err, user) {
            if (err)
                res.send(err);

            User.findById(req.params.user_id, function(err, user) {
                if(err)
                    res.send(err)
                res.send(user);
            });
        });
});

//Modify the description of a user
router.put('/update/description/:user_id', function(req, res) {
    User.update({_id : req.params.user_id
        },{$set:{description: req.body.description
        }},
        function(err, user) {
            if (err)
                res.send(err);

            User.findById(req.params.user_id, function(err, user) {
                if(err)
                    res.send(err)
                res.send(user);
            });
        });
});

//Modify the photo of a user
router.put('/update/photo/:user_id', function(req, res) {
    User.update({_id : req.params.user_id
        },{$set:{photo: req.body.photo
        }},
        function(err, user) {
            if (err)
                res.send(err);

            User.findById(req.params.user_id, function(err, user) {
                if(err)
                    res.send(err)
                res.send(user);
            });
        });
});

//Modify the username of a user
router.put('/update/username/:user_id', function(req, res) {
    console.log('hole estoy en la funcion');
    console.log(req.body.username);
    User.findOne(req.body.username, function(err, user) {
        console.log('estoy en findune username el usuario encontrado');
        if (err) {
            console.log('Tengo un Error');
            res.send('Tengo un error');
        }
        if (!user) {
            console.log('Estoy en User diferente');
            User.update({
                    _id: req.params.user_id
                }, {
                    $set: {
                        username: req.body.username
                    }
                },
                function (err, user) {
                    if (err)
                        res.send(err);
                    User.findById(req.params.user_id, function (err, user) {
                        if (err)
                            res.send(err)
                        res.send(user);
                    });
                });
        }
        if (user){
            console.log('Estoy en user encontrado');
            res.status(400).send('Este nombre de usuario ya existe prueba con otro')
        }
    });
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/facebook', passport.authenticate('facebook'));

router.get('/twitter/callback', passport.authenticate('twitter',
    { successRedirect: '/#/index', failureRedirect: '/#/login' }
    ));

router.get('/facebook/callback', passport.authenticate('facebook',
    { successRedirect: '/#/index', failureRedirect: '/#/login' }
));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(400).send('The user is not logged');
}

//route for get the seesion id in the front
router.get('/sessionid', isLoggedIn, function(req, res) {
    console.log('profile:' + req.user);
    res.send(req.user);
});

//Get all users
router.get('/', function(req, res) {

    User.find(function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
 
    });

});

module.exports = router;



