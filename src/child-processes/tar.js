import * as spawn from './spawn';
const CMD = 'tar';

/**
 * @param {string} tarballPath
 * @returns {Promise}
 */
export function extractGz(tarballPath) {
  return spawn.output(CMD, ['xfz', tarballPath]);
}
