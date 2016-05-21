'use strict';

const file = require('file');
const rdfParser  = require('./lib/rdf-parser.js');
const async = require('async');
const request = require('request');

// Use a throttled queue to deal with file descriptor limit

const work = async.queue(function(path, done) {

  rdfParser(path, function(err, doc) {

    let options = {
      method: 'PUT',
      url: 'http://localhost:5984/books/' + doc._id,
      json: doc
    };

    request(options, function(err, res, body) {
      if (err) {
        throw Error(err);
      }
      console.log(res.statusCode, body);
      done();
    });

  });
}, 10);

console.log('beginning directory walk');
file.walk(__dirname + '/cache', function(err, dirPath, dirs, files){
  files.forEach(function(path){
    work.push(path);
  });
});
