import './chai';
import * as env from './environment';

/* global describe, it, expect, beforeEach, afterEach */
describe('Environment', () => {
  describe('buildNumber function', () => {
    it('should return the environment variable CIRCLE_BUILD_NUM', () => {
      const old = process.env.CIRCLE_BUILD_NUM;
      process.env.CIRCLE_BUILD_NUM = '72';
      expect(env.buildNumber()).to.equal('72');
      process.env.CIRCLE_BUILD_NUM = old;
    });

    it('should return "0" if CIRCLE_BUILD_NUM', () => {
      const old = process.env.CIRCLE_BUILD_NUM;
      process.env.CIRCLE_BUILD_NUM = '';
      expect(env.buildNumber()).to.equal('0');
      process.env.CIRCLE_BUILD_NUM = old;
    });
  });

  describe('prNumber function', () => {
    it('should return the environment variable CIRCLE_PR_NUMBER', () => {
      const old = process.env.CIRCLE_PR_NUMBER;
      process.env.CIRCLE_PR_NUMBER = '72';
      expect(env.prNumber()).to.equal('72');
      process.env.CIRCLE_PR_NUMBER = old;
    });

    it('should return "0" if CIRCLE_PR_NUMBER', () => {
      const old = process.env.CIRCLE_PR_NUMBER;
      process.env.CIRCLE_PR_NUMBER = '';
      expect(env.prNumber()).to.equal('0');
      process.env.CIRCLE_PR_NUMBER = old;
    });
  });

  describe('sharedKey function', () => {
    it('should return the environment variable CLUSTERNATOR_SHARED_KEY', () => {
      const old = process.env.CLUSTERNATOR_SHARED_KEY;
      process.env.CLUSTERNATOR_SHARED_KEY = 'super secret';
      expect(env.sharedKey()).to.equal('super secret');
      process.env.CLUSTERNATOR_SHARED_KEY = old;
    });

    it('should return "0" if CLUSTERNATOR_SHARED_KEY', () => {
      const old = process.env.CLUSTERNATOR_SHARED_KEY;
      process.env.CLUSTERNATOR_SHARED_KEY = '';
      expect(env.sharedKey()).to.equal('');
      process.env.CLUSTERNATOR_SHARED_KEY = old;
    });
  });
});
