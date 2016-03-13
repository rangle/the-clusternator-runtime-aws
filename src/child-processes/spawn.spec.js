'use strict';

const rewire = require('rewire');
const mockSpawn = require('mock-spawn');

const child = rewire('./spawn');
const C = require('./../chai');

/*global describe, it, expect, beforeEach, afterEach */
describe('Test spawn module', () => {
  let projectRoot = '/';

  beforeEach(() => {
    projectRoot = '/';
    child.__set__('spawn', mockSpawn());
  });

  afterEach(() => {
    child.__set__('spawn', require('child_process').spawn);
  });

  describe('log function', () => {
    it('should resolve if there are no exit errors', (done) => {
      child.log('ls')
        .then(() => C
          .check(done, () => expect(true).to.be.ok))
        .catch(C.getFail(done));
    });

    describe('cases with exit code', () => {

      beforeEach(() => {
        const ms = mockSpawn();
        const runner = ms.simple(1, '');

        runner.stderr = 'test error';
        ms.setDefault(runner);
        child.__set__('spawn', ms);
      });

      it('should reject if there are exit errors', (done) => {
        child.log()
          .then(C.getFail(done))
          .catch((err) => C
            .check(done, () => expect(err instanceof Error).to.be.ok));
      });
    });

    describe('cases with stdout', () => {

      beforeEach(() => {
        const ms = mockSpawn();
        const runner = function runner(done) {
          this.stdout.write('hello world');
          done();
        };

        ms.setDefault(runner);
        child.__set__('spawn', ms);
      });

      it('should resolve if there is output and no exit code', (done) => {
        child.log()
          .then((result) => C
            .check(done, () => expect(true).to.be.ok))
          .catch((err) => C.getFail(done));
      });
    });

    describe('cases with stderr', () => {

      beforeEach(() => {
        const ms = mockSpawn();
        const runner = function runner(done) {
          this.stderr.write('verbose error data that is non fatal');
          this.stdout.write('hello world');
          done();
        };

        ms.setDefault(runner);
        child.__set__('spawn', ms);
      });

      it('should resolve if there is error output and no exit code', (done) => {
        child.log()
          .then((result) => C
            .check(done, () => expect(true).to.be.ok))
          .catch((err) => C.getFail(done));
      });
    });

  });
});
