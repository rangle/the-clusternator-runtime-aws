'use strict';

let spawn = require('./spawn').output;
const CMD = 'tar';

module.exports = {
  extractGz
};

/**
 * @param {string} tarballPath
 * @returns {Promise}
 */
function extractGz(tarballPath) {
  return spawn(CMD, ['xfz', tarballPath]);
}
