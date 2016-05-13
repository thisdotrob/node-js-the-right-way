"use strict";

const
  fs = require('fs'),
  net = require('net'),

  filename = process.argv[2],

  server = net.createServer(function(connection) {
    console.log('Connection received.');

    let watchMsg = {
      type: 'watching',
      file: filename
    };

    connection.write(JSON.stringify(watchMsg) + '\n');

    let watcher = fs.watch(filename, function() {
      let changedMsg = {
        type: 'changed',
        file: filename,
        timeStamp: Date.now()
      };
      connection.write(JSON.stringify(changedMsg) + '\n');
    });

  });

  if (!filename) {
    throw Error('Please provide a filename to watch.');
  }

  server.listen(5432, function() {
    console.log('Listening for connections.');
  });
