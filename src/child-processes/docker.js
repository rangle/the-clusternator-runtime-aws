import * as spawn from './spawn';
const CMD = 'docker';

/**
 * @param {string} imageTag
 * @param {string} path
 * @returns {Promise}
 */
export function build(imageTag, path) {
  return spawn.output(CMD, ['build', '-t', imageTag, path], {
    cwd: path
  });
}

/**
 * @param {string} user
 * @param {string} token
 * @param {string} endPoint
 * @returns {Promise}
 */
export function login(user, token, endPoint) {
  return spawn.output(CMD, [
    'login', '-u', user, '-p', token, '-e', 'none', endPoint,
  ]);
}

/**
 * @param {string} fullImageName
 * @returns {Promise}
 */
export function push(fullImageName) {
  return spawn.output(CMD, ['push', fullImageName]);
}

/**
 * @param {string} image
 * @param {string} target
 * @returns {Promise}
 */
export function tag(image, target) {
  return spawn.output(CMD, ['tag', image, target]);
}
