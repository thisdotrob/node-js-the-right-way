"use strict";
const
  net = require('net'),
  client = net.connect({port: 5432});
client.on('data', function(data) {
  let message = JSON.parse(data);
  if (message.type === 'changed') {
    let date = new Date(message.timeStamp);
    console.log("File " + message.file + " changed at " + date);
  } else if (message.type === 'watching') {
    console.log("Now watching " + message.file);
  } else {
    throw Error("Unrecognised message type: " + message.type);
  }
});
