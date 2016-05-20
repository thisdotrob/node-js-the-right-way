'use strict';

const file = require('file');
const rdfParser  = require('./lib/rdf-parser.js');
const async = require('async');

const work = async.queue(function(path, done) {
  rdfParser(path, function(err, doc) {
    if (err) {
      throw err;
    } else {
      console.log(doc);
    }
  });
}, 1000);

console.log('beginning directory walk');
file.walk(__dirname + '/cache', function(err, dirPath, dirs, files){
  files.forEach(function(path){
    work.push(path);
  });
});
