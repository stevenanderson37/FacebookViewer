var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// CONFIG //
var config = require('./config');

// APP //
var app = module.exports = express();
// app.use(express.static(__dirname + "./../public"));

app.use(session({secret: config.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_clientID,
  clientSecret: config.FACEBOOK_clientSecret,
  callbackURL: 'http://localhost:3021/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/github', passport.authenticate('github'));
// app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/me', function(req, res) {
  if (!req.user) {
    return res.sendStatus(404);
  } else {
    res.status(200).send(req.user);
  }
})

var port = config.PORT;
app.listen(port, function() {
	console.log('Listening on port ' + port);
});
