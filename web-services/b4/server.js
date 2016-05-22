#!/Users/R/.nvm/v0.10.20/bin/node --harmony
'use strict';

const express = require('express');
const app = express();

app.use(express.logger('dev'));

const config = {
  bookdb: 'http://localhost:5984/books/',
  b4db: 'http://localhost:5984/b4/'
};

require('./lib/field-search.js')(config, app);

app.listen(3000, function() {
  console.log('Listening on 3000.');
});
