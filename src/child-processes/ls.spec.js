'use strict';

const rewire = require('rewire');
const ls = rewire('./ls');
const C = require('./../chai');

/*global describe, it, expect, beforeEach, afterEach */
describe('RM CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = ls.__get__('spawn');
    ls.__set__('spawn', () => spawnCount += 1);
  });

  afterEach(() => {
    ls.__set__('spawn', oldSpawn);
  });

  describe('ls function', () => {
    it('should call spawn once', () => {
      ls('path');
      expect(spawnCount).to.equal(1);
    });
  });

});
