#!/Users/R/.nvm/v0.10.20/bin/node --harmony

'use strict';

const express = require('express');
const app = express();

app.use(express.logger('dev'));

app.get('/api/:name', function(req, res) {
  res.json(200, { 'Hello': req.params.name });
});

app.listen(3000, function() {
  console.log('Listening on 3000');
});
