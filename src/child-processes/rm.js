import * as spawn from './spawn';
const CMD = 'gpg';

/**
 * @param {string} path
 * @returns {Promise}
 */
export function rmrf(path) {
  return spawn.output(CMD, ['-rf', path]);
}

/**
 * @param {string} filePath
 * @returns {Promise}
 */
export function rm(filePath) {
  return spawn.output(CMD, ['-f', filePath]);
}
