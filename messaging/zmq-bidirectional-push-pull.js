'use strict';

const
  zmq = require('zmq'),
  cluster = require('cluster');

if (cluster.isMaster) {
  let
    pusher = zmq.socket('push').bind('ipc://master-pusher.ipc'),
    puller = zmq.socket('pull').bind('ipc://master-puller.ipc');

  let workerCount = 0;

  puller.on('message', function(data) {

    let message = JSON.parse(data);

    if (message.type === 'ready') {
      workerCount++;
      console.log(message.pid + ' is ready.');

      if (workerCount === 3) {
        console.log('Sending jobs.');

        for (let i = 0; i < 30; i++) {
          pusher.send(JSON.stringify({
            type: 'job',
            jobNumber: i
          }));
          console.log('job ' + i + ' sent.');
        }

      }

    } else if (message.type === 'result') {
      console.log(message.pid + ' sent result for job ' + message.jobNumber);
    }
  });

  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }

} else {

  let
    pusher = zmq.socket('push').connect('ipc://master-puller.ipc'),
    puller = zmq.socket('pull').connect('ipc://master-pusher.ipc');

  puller.on('message', function(data) {
    let message = JSON.parse(data);
    if (message.type === 'job') {
      pusher.send(JSON.stringify({
        type: 'result',
        pid: process.pid,
        jobNumber: message.jobNumber
      }));
    }
  });

  pusher.send(JSON.stringify({
    type: 'ready',
    pid: process.pid
  }));

}
