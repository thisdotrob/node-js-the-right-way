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

  app.get('/api/bundle/:id', function(req, res) {

    let onResolved = function(args){
      let couchRes = args[0];
      let bundle = JSON.parse(args[1]);
      res.json(couchRes.statusCode, bundle);
    };

    let onRejected = function(err) {
      res.json(502, { error: "bad_gateway", reason: err.code });
    };

    q.nfcall(request.get, config.b4db + '/' + req.params.id)
      .then(onResolved, onRejected).done();
  });

  app.get('/api/bundle/:id/name/:name', function(req, res) {
    q.nfcall(request.get, config.b4db + '/' + req.params.id)
      .then(function(args) {
        let couchRes = args[0];
        let bundle = JSON.parse(args[1]);
        if (couchRes.statusCode !== 200) {
          return [couchRes, bundle];
        }
        bundle.name = req.params.name;
        return q.nfcall(request.put, {
          url: config.b4db + '/' + req.params.id,
          json: bundle
        });
      })
      .then(function(args) {
        let couchRes = args[0];
        let body = args[1];
        res.json(couchRes.statusCode, body);
      })
      .catch(function(err) {
        res.json(502, { error: 'bad_gateway', reason: err.code });
      })
      .done();
  });

};
