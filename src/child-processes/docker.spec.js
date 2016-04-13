import './../chai';
import * as rewire from 'rewire';
const docker = rewire('./docker');

/* global describe, it, expect, beforeEach, afterEach */
describe('Docker CLI Wrapper', () => {
  let oldSpawn;
  let spawnCount;

  beforeEach(() => {
    spawnCount = 0;
    oldSpawn = docker.__get__('spawn.output');
    docker.__set__('spawn.output', () => { spawnCount += 1; });
  });

  afterEach(() => {
    docker.__set__('spawn.output', oldSpawn);
  });

  describe('build function', () => {
    it('should call spawn once', () => {
      docker.build('rafkhan/testImage', './');
      expect(spawnCount).to.equal(1);
    });
  });

  describe('tag function', () => {
    it('should call spawn once', () => {
      docker.tag('image', 'dest');
      expect(spawnCount).to.equal(1);
    });
  });

  describe('push function', () => {
    it('should call spawn once', () => {
      docker.push('imageName');
      expect(spawnCount).to.equal(1);
    });
  });
});
