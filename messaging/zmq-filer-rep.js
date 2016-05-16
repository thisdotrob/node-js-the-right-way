'use strict';

const
  fs = require('fs'),
  zmq = require('zmq'),
  responder = zmq.socket('rep');

responder.on('message', function(data) {
  let request = JSON.parse(data);

  fs.readFile(request.path, function(err, content) {
    let response = {
      content: content,
      timestamp: Date.now(),
      pid: process.pid
    };
    responder.send(JSON.stringify(response));
  });
});

responder.bind('tcp://*:5433', function(err) {
  console.log('Listening for zmq requesters...');
});

process.on('SIGINT', function() {
  console.log('Shutting down...');
  responder.close(); // close the responder when the Node process ends
});
