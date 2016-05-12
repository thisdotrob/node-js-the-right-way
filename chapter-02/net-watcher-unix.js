"use strict"

const
  fs = require('fs'),
  net = require('net'),
  filename = process.argv[2],
  server = net.createServer(function(connection) {
    console.log('Connection made.');
    connection.write('Watching ' + filename + ' for changes.\n');
    let watcher = fs.watch(filename, function() {
      connection.write(filename + ' has been changed.\n');
    });
    connection.on('close', function() {
      console.log('Connection closed.');
      watcher.close();
    });
  });

if (!filename) {
  throw Error('Must provide a filename.');
}

server.listen('/tmp/watcher.sock', function() {
  console.log('Listening for subscribers...');
});

// to run:
// node --harmony net-watcher-unix.js target.txt
// nc -U /tmp/watcher.sock
