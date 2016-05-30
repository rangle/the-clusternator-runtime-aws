import * as C from '../chai';
import rewire from 'rewire';
import mockSpawn from 'mock-spawn';

const child = rewire('./spawn');

/* global describe, it, expect, beforeEach, afterEach */
describe('Test spawn module', () => {
  beforeEach(() => {
    child.__set__('childProcess', { spawn: mockSpawn() });
  });

  afterEach(() => {
    child.__set__('childProcess', { spawn: require('child_process').spawn });
  });

  describe('output function', () => {
    it('should resolve if there are no exit errors', (done) => {
      child.output('ls')
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
        child.__set__('childProcess', { spawn: ms });
      });

      it('should reject if there are exit errors', (done) => {
        child.output()
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
        child.__set__('childProcess', { spawn: ms });
      });

      it('should resolve if there is output and no exit code', (done) => {
        child.output()
          .then(() => C
            .check(done, () => expect(true).to.be.ok))
          .catch(C.getFail(done));
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
        child.__set__('childProcess', { spawn: ms });
      });

      it('should resolve if there is error output and no exit code', (done) => {
        child.output()
          .then(() => C
            .check(done, () => expect(true).to.be.ok))
          .catch(C.getFail(done));
      });
    });
  });
});
