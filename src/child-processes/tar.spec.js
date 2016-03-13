'use strict';

const rewire = require('rewire');
const tar = rewire('./tar');
const C = require('./../chai');

/*global describe, it, expect, beforeEach, afterEach */
describe('TAR CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = tar.__get__('spawn');
    tar.__set__('spawn', () => spawnCount += 1);
  });

  afterEach(() => {
    tar.__set__('spawn', oldSpawn);
  });

  describe('extractGz function', () => {
    it('should call spawn once', () => {
      tar.extractGz('file');
      expect(spawnCount).to.equal(1);
    });
  });

});
