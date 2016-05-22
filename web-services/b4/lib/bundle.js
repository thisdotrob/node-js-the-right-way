'use strict';

const request = require('request');
const q = require('q');

module.exports = function(config, app) {

  app.post('/api/bundle', function(req, res) {
    let deferred = q.defer();

    let options = {
      url: config.b4db,
      json: { type: 'bundle', name: req.query.name, books: {} }
    };

    request.post(options, function(err, couchRes, body) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve([couchRes, body]);
      }
    });

    let onResolved = function(args) {
      let couchRes = args[0];
      let body = args[1];
      res.json(couchRes.statusCode, body);
    };

    let onRejected = function(err) {
      res.json(502, { error: 'bad_gateway', reason: err.code });
    };

    deferred.promise.then(onResolved, onRejected);

  });

};
