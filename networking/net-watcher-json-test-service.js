"use strict";

//test service that purposefully splits a message into multiple chunks.

const
  net = require('net'),
  server = net.createServer(function(connection) {

    console.log('Connection received.');

    connection.write('{"type":"changed","file":"targ');

    let secondWrite = function secondWrite() {
      connection.write('et.txt","timestamp":1358175758495}' + '\n');
      connection.end();
    };

    let timer = setTimeout(secondWrite, 1000);

    connection.on('end', function() {
      clearTimeout(timer);
      console.log('Client disconnected.');
    });

  });

server.listen(5432, function() {
  console.log('Test server listening for connecftions.');
});
