/**
 * @module spawn
 */

/** @type {function(...)} */
import  * as logger from '../log';
import * as childProcess from 'child_process';

const log = logger.log;


/**
 * @param {string} command
 * @param {string} args
 * @returns {string}
 */
function commandStr(command, args) {
  return `${command} ${args.join(' ')}`;
}

/**
 * @param {string} command
 * @param {string} args
 * @param {string|number} code
 * @returns {string}
 */
function successString(command, args, code) {
  return `${commandStr(command, args)}   Process Exited: ${code}`;
}

/**
 * @param {string} command
 * @param {string} args
 * @param {string|number} code
 * @param {string=} stderr
 * @returns {string}
 */
function failString(command, args, code, stderr = '') {
  return `${commandStr(command, args)} terminated with exit code: ${code} ` +
    stderr;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {number} code
 * @param {string=} stderr
 * @returns {Error}
 */
function failError(command, args, code, stderr = '') {
  log('Failed: ', command, args, code, stderr);

  const numericCode = parseInt(code, 10);

  const errString = failString(command, args, numericCode, stderr);
  const e = new Error(errString);
  e.code = code;

  return e;
}

/**
 * Resolves stdout, rejects with stderr, also streams
 * @param {string} command
 * @param {Array.<string>=} args
 * @param {Object=} opts
 * @returns {Promise}
 */
export function output(command, args = [], opts = {}) {
  const options = Object.assign({}, opts);
  const child = childProcess.spawn(command, args, options);

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (data) => {
    log(data);
  });

  child.stderr.on('data', (data) => {
    log(data);
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (+code) {
        reject(failError(command, args, code));
      } else {
        log(successString(command, args, code));
        resolve();
      }
    });

    child.stdin.end();
  });
}
