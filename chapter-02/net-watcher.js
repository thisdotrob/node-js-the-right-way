"use strict"

const
  fs = require('fs'),
  net = require('net'),
  filename = process.argv[2],
  server = net.createServer(function(connection) {

    console.log('Connection made.');

    connection.write('Watching ' + filename + ' for changes.\n');

    let watcher = fs.watch(filename, function() {
      connection.write('File ' + filename + ' changed\n');
    });

    connection.on('close', function() {
      console.log('Connection closed.');
      watcher.close();
    });
  });

if (!filename) {
  throw Error('Please provide a filename.');
}

server.listen(5432, function() {
  console.log('Listening for connections.');
});
