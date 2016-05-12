const
  fs = require('fs');
  filename = process.argv[2];

console.log('Path to node: ' + process.argv[0]);

console.log('Path to this file: ' + process.argv[1]);


if (!filename) {
    throw Error('Error - must specify a filename.');
}

fs.watch(filename, function() {
  console.log('File: ' + filename + ' changed!');
});

console.log('Watching ' + filename + ' for changes.');
