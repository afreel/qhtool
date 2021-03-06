var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

GLOBAL.Parse = require('parse').Parse;
Parse.initialize("XXXXXXX", "XXXXXXX");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// EJS PARTIALS FUNCTIONS //
app.locals.insertSpaces = function(name) {
    return name.split('_').join(' ');
}
////////////////////////////

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon-32x32.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')(passport);
var query = require('./routes/query');
var requests = require('./routes/requests');
var rooms = require('./routes/rooms');
var users = require('./routes/users');
var subjects = require('./routes/subjects');

app.use('/', routes);
app.use('/query', query);
app.use('/requests', requests);
app.use('/rooms', rooms);
app.use('/users', users);
app.use('/subjects', subjects);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(3000,function(){
    console.log("We have started our server on port 3000");
});

module.exports = app;
