const fs = require('fs');

fs.watch('target.md', function() {
  console.log('target.md has changed!')
});

console.log('watching target.md');
