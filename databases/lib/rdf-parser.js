'use strict';

const fs = require('fs');
const cheerio = require('cheerio');

module.exports = function(filename, callback) {

  fs.readFile(filename, function(err, data) {

    if (err) { return callback(err); }

    let $ = cheerio.load(data.toString());

    let collect = function(index, elem) {
      return $(elem).text();
    };

    let details = {
      _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
      title: $('dcterms\\:title').text(),
      authors: $('pgterms\\:agent pgterms\\:name').map(collect),
      subjects: $('[rdf\\:resource$="/LCSH"]').siblings('rdf\\:value').map(collect)
    };

    callback(null, details);

  });
};
