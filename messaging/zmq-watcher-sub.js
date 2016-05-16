"use strict";

const
  zmq = require('zmq'),
  subscriber = zmq.socket('sub');

subscriber.subscribe('');

subscriber.on('message', function(data) {
  let
    message = JSON.parse(data),
    time = new Date(message.timestamp);

  console.log('File ' + message.file + ' changed at ' + time);
});

subscriber.connect("tcp://localhost:5432");
