'use strict';

let spawn = require('./spawn').output;
const CMD = 'docker';

module.exports = {
  build,
  login,
  push,
  tag
};

/**
 * @param {string} imageTag
 * @param {string} path
 * @returns {Promise}
 */
function build(imageTag, path) {
  return spawn(CMD, ['build', '-t', imageTag, path]);
}

/**
 * @param {string} user
 * @param {string} token
 * @param {string} endPoint
 * @returns {Promise}
 */
function login(user, token, endPoint) {
  return spawn(CMD, ['login', '-u', user, '-p', token, '-e', 'none', endPoint]);
}

/**
 * @param {string} fullImageName
 * @returns {Promise}
 */
function push(fullImageName) {
  return spawn(CMD, ['push', fullImageName]);
}

/**
 * @param {string} image
 * @param {string} target
 * @returns {Promise}
 */
function tag(image, target) {
  return spawn(CMD, ['tag', image, target]);
}
