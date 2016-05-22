'use strict';

const request = require('request');
const q = require('q');

module.exports = function(config, app) {

  // create a new bundle with the specified name
  // e.g. curl -X POST http://localhost:3000/api/bundle?name=<name>
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

  // get a given bundle
  // e.g. curl -X POST http://localhost:3000/api/bundle/<id>
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

  // set the specified bundle's name with the specified name
  // e.g. curl -X PUT http://localhost:3000/api/bundle/<id>/name/<name>
  app.put('/api/bundle/:id/name/:name', function(req, res) {
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

  // put a book into a bundle by its id
  // e.g. curl -X PUT http://localhost:3000/api/bundle/<id>/book/<pgid>
  app.put('/api/bundle/:id/book/:pgid', function(req, res) {

    let get = q.denodeify(request.get);
    let put = q.denodeify(request.put);

    q.async(function* (){
      // grab the bundle from the b4 database
      let args = yield get(config.b4db + req.params.id);
      let couchRes = args[0];
      let bundle = JSON.parse(args[1]);

      // fail fast if we couldn't retrieve the bundle
      if (couchRes.statusCode !== 200) {
        res.json(couchRes.statusCode, bundle);
        return;
      }

      // look up the book by its Project Gutenberg ID
      args = yield get(config.bookdb + req.params.pgid);
      couchRes = args[0];
      let book = JSON.parse(args[1]);

      // fail fast if we couldn't retrieve the book
      if (couchRes.statusCode !== 200) {
        res.json(couchRes.statusCode, book);
        return;
      }

      // add the book to the bundle and put it back in CouchDB
      bundle.books[book._id] = book.title;
      args = yield put({ url: config.b4db + bundle._id, json: bundle });
      couchRes = args[0];
      let body = args[1];
      res.json(couchRes.statusCode, body);

    })()
    .catch(function(err) {
      res.json(502, { error: "bad_gateway", reason: err.code });
    });
  });

};
