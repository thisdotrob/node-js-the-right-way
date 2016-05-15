"use strict";
const
  net = require('net'),
  ldj = require('./ldj.js'),
  netClient = net.connect({port: 5432}),
  ldjClient = ldj.connect(netClient);
ldjClient.on('message', function(message) {
  if (message.type === 'changed') {
    let date = new Date(message.timeStamp);
    console.log("File " + message.file + " changed at " + date);
  } else if (message.type === 'watching') {
    console.log("Now watching " + message.file);
  } else {
    throw Error("Unrecognised message type: " + message.type);
  }
});
