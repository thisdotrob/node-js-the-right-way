'use stict';

module.exports = {

  // ./dbcli.js GET books/_design/books/_view/by_author?group=true

  by_author: {

    map: function(doc) {
      if ('authors' in doc) {
        doc.authors.forEach(emit);
      }
    }.toString(),

    reduce: '_count'
  },

  by_subject: {

    map: function(doc) {
      if ('subjects' in doc) {
        doc.subjects.forEach(function(subject){
          emit(subject, subject);
          subject.split(/\s+--\s+/).forEach(function(part){
            emit(part, subject);
          });
        });
      }
    }.toString(),

    reduce: '_count'
  }
};
