'use strict';

const rewire = require('rewire');
const gpg = rewire('./gpg');
const C = require('./../chai');

/*global describe, it, expect, beforeEach, afterEach */
describe('GPG CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = gpg.__get__('spawn');
    gpg.__set__('spawn', () => spawnCount += 1);
  });

  afterEach(() => {
    gpg.__set__('spawn', oldSpawn);
  });

  describe('decryptWithPassphrase function', () => {
    it('should call spawn once', () => {
      gpg.decryptWithPassphrase('a', 'b', 'c');
      expect(spawnCount).to.equal(1);
    });
  });

});
