'use strict';

const request = require('request');

module.exports = function(config, app) {

  // author and subject search
  // curl http://localhost:3000/api/search/author?q=Giles
  // curl http://localhost:3000/api/search/subject?q=Croc

  app.get('/api/search/:view', function(req, res) {

    let options = {
      method: 'GET',
      url: config.bookdb + '_design/books/_view/by_' + req.params.view,
      qs: {
        startkey: JSON.stringify(req.query.q),
        endkey: JSON.stringify(req.query.q + "\ufff0"),
        group: true
      }
    };

    request(options, function(err, couchRes, body) {

      // The error case: CouchDB didn’t respond
      if (err) {
        res.json(502, { error: 'bad_gateway', reason: err.code });
        return;
      }

      // Non-success case: CouchDB responded, but it wasn’t the HTTP 200 OK
      // result that we expected, so we pass it verbatim back
      if (couchRes.statusCode !== 200) {
        res.json(couchRes.statusCode, JSON.parse(body));
        return;
      }

      // Success case
      let rows = JSON.parse(body).rows;

      res.json(rows.map(function(elem) {
        return elem.key;
      }));

    });
  });
};
