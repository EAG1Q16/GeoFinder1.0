var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var expressValidator = require('express-validator');



//Indexing routes
var routes = require('./app/routes/index');
var users = require('./app/routes/usersroutes');
var adventures = require('./app/routes/adventuresroutes');
var hints = require('./app/routes/hintsroutes');
var comments = require('./app/routes/commentroutes');

//Declarate express
var app = express();

//Mongose conection
var database = require('./bin/database');
mongoose.connect(database.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//CORS header
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin');
    res.header("Access-Control-Max-Age", "86400"); // 24 hours

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {secure: false}
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// use connect-flash for flash messages stored in session
app.use(flash());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes where api calls
app.use('/', routes);
app.use('/user', users);
app.use('/adventures', adventures);
app.use('/hints', hints);
app.use('/comments', comments);

module.exports = app;

