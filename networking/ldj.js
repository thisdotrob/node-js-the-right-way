"use strict";

const
  events = require('events'),
  util = require('util'),

  //client constructor
  LDJClient = function(stream) {
    //call the EventEmitter constructor on this
    events.EventEmitter.call(this);
  };

//make LDJClient’s prototypal parent object the EventEmitter prototype.
util.inherits(LDJClient, events.EventEmitter);
