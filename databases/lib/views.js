'use stict';

module.exports = {

  // ./dbcli.js GET books/_design/books/_view/by_author?group=true

  by_author: {

    map: function(doc) {
      if ('authors' in doc) {
        doc.authors.forEach(emit);
      }
    }.toString(),

    // group by author on book count

    reduce: '_count'
  },

  // ./dbcli.js GET books/_design/books/_view/by_subjet?group=true

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

    // group by subject on book count

    reduce: '_count'
  }
};
