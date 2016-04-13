import * as rewire from 'rewire';
const C = rewire('./chai');

/* global describe, it, expect, beforeEach, afterEach */
describe('Chai Helpers', () => {
  let oldChai;
  let expectCount;

  beforeEach(() => {
    expectCount = 0;
    oldChai = C.__get__('chai');
    C.__set__('chai', {
      expect: () => {
        expectCount += 1;
        return {
          to: {
            be: {
              ok: 'test ok',
            },
          },
        };
      },
    });
  });

  afterEach(() => {
    C.__set__('chai', oldChai);
  });

  describe('check function', () => {
    it('should handle functions that return', () => {
      let done = false;
      C.check(() => { done = true; }, () => 'hello');
      expect(done).to.equal(true);
    });

    it('should handle functions that throw', () => {
      let done = false;
      C.check(() => { done = true; }, () => {
        throw new Error('test');
      });
      expect(done).to.equal(true);
    });
  });

  describe('getFail function', () => {
    it('should call done with an error if given an error', () => {
      let isDone = false;
      const fail = C.getFail((err) => {
        isDone = true;
        expect(err instanceof Error).to.be.ok;
      });
      fail(new Error('test'));
      expect(isDone).to.equal(true);
    });

    it('should call done with an error if given a non Error', () => {
      let isDone = false;
      const fail = C.getFail((err) => {
        isDone = true;
        expect(err instanceof Error).to.be.ok;
      });
      fail('test');
      expect(isDone).to.equal(true);
    });
  });
});
