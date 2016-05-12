"use strict"

const
  fs = require('fs'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

if (!filename) {
  throw Error('Error: must specify a filename');
}

fs.watch(filename, function() {
  let
    ls = spawn('ls', ['-lh', filename]),
    output = '';

  ls.stdout.on('data', function(chunk) {
    output += chunk.toString();
  });

  ls.on('close', function() {
    let
      parts = output.split(/\s+/),
      permissions = parts[0],
      size = parts[4],
      filename = parts[8];

    console.dir([permissions, size, filename]);
  });
});

console.log("Now watching " + filename + " for changes.");
