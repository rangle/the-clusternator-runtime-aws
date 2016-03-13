'use strict';

const rewire = require('rewire');
const rm = rewire('./rm');
const C = require('./../chai');

/*global describe, it, expect, beforeEach, afterEach */
describe('RM CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = rm.__get__('spawn');
    rm.__set__('spawn', () => spawnCount += 1);
  });

  afterEach(() => {
    rm.__set__('spawn', oldSpawn);
  });

  describe('rm function', () => {
    it('should call spawn once', () => {
      rm('path');
      expect(spawnCount).to.equal(1);
    });
  });

  describe('rf function', () => {
    it('should call spawn once', () => {
      rm.rf('path');
      expect(spawnCount).to.equal(1);
    });
  });

});
