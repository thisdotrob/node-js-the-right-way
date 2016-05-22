#!/Users/R/.nvm/v0.10.20/bin/node --harmony
'use strict';

const express = require('express');
const app = express();
const redisClient = require('redis').createClient();
const RedisStore = require('connect-redis')(express);

app.use(express.logger('dev'));

app.use(express.cookieParser());
app.use(express.session({
  secret: 'awesomesecret',
  store: new RedisStore({ client: redisClient })
}));

app.get('/api/:name', function(req, res) {
  res.json(200, { 'Hello': req.params.name });
});

app.listen(3000, function() {
  console.log('Listening on 3000');
});
