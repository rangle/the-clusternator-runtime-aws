import './chai';
import * as appDef from './app-def';

/* global describe, it, expect, beforeEach, afterEach */
describe('App Def', () => {
  const appDef_ = {};

  beforeEach(() => {
    appDef_.tasks = [{
      containerDefinitions: [{
        environment: [],
      }],
    }];
  });

  describe('populateAppDef', () => {
    it('should return a string', () => {
      expect(typeof appDef
        .populateAppDef(
          appDef_, 'key', 'host', 'repo', 'pr', 'image', 'deployment')
      ).to.equal('string');
    });

    it('should make PR urls as expected', () => {
      const def = JSON.parse(appDef
        .populateAppDef(
          appDef_, 'key', 'host', 'repo', '321', 'image', 'pr')
      );
      expect(def.tasks[0].containerDefinitions[0].hostname)
        .to.equal('repo-pr-321.host');
    });

    it('should make Deployment urls as expected', () => {
      const def = JSON.parse(appDef
        .populateAppDef(
          appDef_, 'key', 'host', 'repo', '', 'image', 'beta')
      );
      expect(def.tasks[0].containerDefinitions[0].hostname)
        .to.equal('repo-beta.host');
    });

    it('should make master Deployment urls as expected', () => {
      const def = JSON.parse(appDef
        .populateAppDef(
          appDef_, 'key', 'host', 'repo', '', 'image', 'master')
      );
      expect(def.tasks[0].containerDefinitions[0].hostname)
        .to.equal('repo.host');
    });
  });
});
