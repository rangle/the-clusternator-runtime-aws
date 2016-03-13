'use strict';

let spawn = require('./spawn').output;
const CMD = 'gpg';

module.exports = rm;
rm.rf = rf;

/**
 * @param {string} path
 * @returns {Promise}
 */
function rf(path) {
  return spawn(CMD, ['-rf', path]);
}

/**
 * @param {string} filePath
 * @returns {Promise}
 */
function rm(filePath) {
  return spawn(CMD, ['-f', filePath]);
}