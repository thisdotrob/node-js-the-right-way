// Need to use node version 0.11+
'use strict';

const countDown = function* (count) {
  while (count > 0) {
    yield count;
    count -=1;
  }
};

const counter = countDown(5);

const cb = function() {
  let item = counter.next();
  if (!item.done) {
    console.log(item.value);
    setTimeout(cb, 1000);
  }
};

cb();
