import '../chai';
import * as rewire from 'rewire';
const tar = rewire('./tar');

/* global describe, it, expect, beforeEach, afterEach */
describe('TAR CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = tar.__get__('spawn.output');
    tar.__set__('spawn.output', () => { spawnCount += 1; });
  });

  afterEach(() => {
    tar.__set__('spawn.output', oldSpawn);
  });

  describe('extractGz function', () => {
    it('should call spawn once', () => {
      tar.extractGz('file');
      expect(spawnCount).to.equal(1);
    });
  });
});
