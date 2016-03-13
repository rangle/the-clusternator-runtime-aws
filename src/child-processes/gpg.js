'use strict';

let spawn = require('./spawn').output;
const CMD = 'gpg';

module.exports = {
  decryptWithPassphrase
};

/**
 * @param {string} passphrase
 * @param {string} outputFilePath
 * @param {string} inputFilePath
 * @returns {Promise}
 */
function decryptWithPassphrase(passphrase, outputFilePath, inputFilePath) {
  return spawn(CMD, [
    'passphrase', passphrase,
    'output', outputFilePath,
    'decrypt', inputFilePath
  ]);
}