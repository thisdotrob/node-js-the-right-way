#!/Users/R/.nvm/v0.10.20/bin/node --harmony

'use strict';

const request = require('request');
const views = require('./lib/views.js');
const async = require('async');

let cb = function(err, res, body) {
  if (err) { throw err; }
  console.log(res.statusCode, body);
};

async.waterfall([

  function(next) {
    request.get('http://localhost:5984/books/_design/books', next);
  },

  function(res, body, next) {
    let statusCode = res.statusCode;
    if (statusCode === 200) {
      next(null, JSON.parse(body));
    } else if (statusCode === 404) {
      next(null, { views: {} });
    }
  },

  function(doc, next) {
    Object.keys(views).forEach(function(key) {
      doc.views[key] = views[key];
    });
    let options = {
      method: 'PUT',
      url: 'http://localhost:5984/books/_design/books',
      json: doc
    };
    request(options, next);
  }
  
], cb);
