'use strict';

module.exports = {
  log
};

function log() {
  const args = Array.prototype.slice.call(arguments, 0);
  /*eslint no-console: 0*/
  console.log.apply(console, args);
}
