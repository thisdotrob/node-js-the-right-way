#!/Users/R/.nvm/v0.10.20/bin/node --harmony
'use strict';

const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google').Strategy;

app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'awesomesecret' }));
app.use(passport.initialize());
app.use(passport.session());

const config = {
  bookdb: 'http://localhost:5984/books/',
  b4db: 'http://localhost:5984/b4/'
};
require('./lib/field-search.js')(config, app);
require('./lib/bundle.js')(config, app);

passport.serializeUser(function(user, done) {
  done(null, user.identifier);
});
passport.deserializeUser(function(id, done) {
  done(null, { identifier: id });
});
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    profile.identifier = identifier;
    return done(null, profile);
  }
));

app.get('/auth/google/:return?',
  passport.authenticate('google', { successRedirect: '/' })
);
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Listening on 3000.');
});
