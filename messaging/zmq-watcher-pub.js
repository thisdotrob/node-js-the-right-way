"use strict";

const
  fs = require('fs'),
  zmq = require('zmq'),
  publisher = zmq.socket('pub'), // create publisher end point
  filename = process.argv[2];

fs.watch(filename, function() {
  let message = JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  });
  publisher.send(message); // send message to any subscribers
});

publisher.bind('tcp://*:5432', function(err) {  // listen on tcp port 5432
  console.log('Listening for zmq subscribers...');
});
