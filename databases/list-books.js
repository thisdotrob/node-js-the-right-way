'use strict';

const file = require('file');
const rdfParser = require('./lib/rdf-parser.js');

// Demonstrates the file descriptor limit issue (should raise "Error: EMFILE")

console.log('beginning directory walk');file.walk(__dirname + '/cache', function(err, dirPath, dirs, files){
  files.forEach(function(path){    rdfParser(path, function(err, doc) {
      if (err) {        throw err;
      } else {        console.log(doc);
      }    });
  });});
