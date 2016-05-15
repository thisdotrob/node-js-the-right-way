"use strict";

const
  events = require('events'),
  util = require('util'),

  // client constructor
  LDJClient = function(stream) {
    // call the EventEmitter constructor on this
    events.EventEmitter.call(this);
    let
      self = this,
      buffer = '';
    stream.on('data', function(data) {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        let input = buffer.substr(0, boundary);
        buffer = buffer.substr(boundary + 1);
        self.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });
  };

// make LDJClient’s prototypal parent object the EventEmitter prototype.
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream) {
  return new LDJClient(stream);
};
