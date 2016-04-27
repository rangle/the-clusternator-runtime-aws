import '../chai';
import rewire from 'rewire';
const rm = rewire('./rm');

/* global describe, it, expect, beforeEach, afterEach */
describe('RM CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = rm.__get__('spawn.output');
    rm.__set__('spawn.output', () => { spawnCount += 1; });
  });

  afterEach(() => {
    rm.__set__('spawn.output', oldSpawn);
  });

  describe('rm function', () => {
    it('should call spawn once', () => {
      rm.rm('path');
      expect(spawnCount).to.equal(1);
    });
  });

  describe('rf function', () => {
    it('should call spawn once', () => {
      rm.rmrf('path');
      expect(spawnCount).to.equal(1);
    });
  });
});
