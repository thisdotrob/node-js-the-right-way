#!/Users/R/.nvm/v0.10.20/bin/node --harmony
'use strict';

const express = require('express');
const app = express();
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const redisClient = require('redis').createClient();
const RedisStore = require('connect-redis')(express);
const log = require('npmlog');

const authed = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else if (redisClient.ready) {
    res.json(403, { error: "forbidden", reason: "not_authenticated" });
  } else {
    res.json(503, { error: "service_unavailable", reason: "authentication_unavailable" });
  }
};

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
passport.use(new BasicStrategy(
  function(userid, password, done) {
    return done(null, { 'identifier': 'fakeuser' });
  }
));

app.get('/auth/basic/:return?',
  passport.authenticate('basic', { successRedirect: '/' })
);
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/api/user', authed, function(req, res){
  res.json(req.user);
});

redisClient.on('ready', function() { log.info('REDIS', 'ready'); });
redisClient.on('error', function(err) { log.error('REDIS', err.message ); });

app.listen(3000, function() {
  console.log('Listening on 3000.');
});
