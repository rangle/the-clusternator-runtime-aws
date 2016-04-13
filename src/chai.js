/**
 * These functions are used as helpers for unit tests
 * @module chai
 */
import * as chai from 'chai';

chai.config.includeStack = true;

global.expect = chai.expect;

/* global describe, it, expect, beforeEach, afterEach */
/**
  @param {function(...)} done
  @param {function(...)} fn
*/
export function check(done, fn) {
  try {
    fn();
    done();
  } catch (err) {
    done(err);
  }
}

/**
  @param {function(...)} done
  @return {function(Error|*)}
*/
export function getFail(done) {
  return (err) => {
    if (err instanceof Error) {
      done(err);
    } else {
      done(new Error('this case should not happen'));
    }
  };
}

