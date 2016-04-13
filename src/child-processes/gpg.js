import * as spawn from './spawn';
const CMD = 'gpg';

/**
 * @param {string} passphrase
 * @param {string} outputFilePath
 * @param {string} inputFilePath
 * @returns {Promise}
 */
export function decryptWithPassphrase(
  passphrase, outputFilePath, inputFilePath) {
  return spawn.output(CMD, [
    'passphrase', passphrase,
    'spawn.output', outputFilePath,
    'decrypt', inputFilePath,
  ]);
}
