import '../chai';
import rewire from 'rewire';
const gpg = rewire('./gpg');

/* global describe, it, expect, beforeEach, afterEach */
describe('GPG CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = gpg.__get__('spawn.output');
    gpg.__set__('spawn.output', () => { spawnCount += 1; });
  });

  afterEach(() => {
    gpg.__set__('spawn.output', oldSpawn);
  });

  describe('decryptWithPassphrase function', () => {
    it('should call spawn once', () => {
      gpg.decryptWithPassphrase('a', 'b', 'c');
      expect(spawnCount).to.equal(1);
    });
  });
});
