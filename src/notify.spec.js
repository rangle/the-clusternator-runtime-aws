import * as C from './chai';
import rewire from 'rewire';

const notify = rewire('./notify');

/* global describe, it, expect, beforeEach, afterEach */
describe('Notify module', () => {
  describe('post function', () => {
    const http = {};
    const httpResponse = {};
    let oldHttp;

    beforeEach(() => {
      oldHttp = notify.__get__('http');
      httpResponse.on = () => {};
      httpResponse.setEncoding = () => {};
      notify.__set__('http', http);
      http.request = (options, cb) => {
        cb(httpResponse);
        return {
          write: () => {},
          end: () => {},
        };
      };
    });

    afterEach(() => {
      notify.__set__('http', oldHttp);
    });

    it('should resolve a promise', (done) => {
      httpResponse.on = (message, cb) => {
        if (message === 'data') { setTimeout(() => cb('sloth'), 0); }
      };
      notify.post({}, 'authToken', '/path/on/server', 'clusternator.com')
        .then(() => C.check(done, () => expect(true).to.be.ok))
        .catch(C.getFail(done));
    });
  });

  describe('notify function', () => {
    let oldPost;

    beforeEach(() => {
      oldPost = notify.__get__('post');
      notify.__set__('post', () => Promise.resolve());
    });

    afterEach(() => {
      notify.__set__('post', oldPost);
    });

    it('should resolve a promise', (done) => {
      notify.notify({}, {}, '/path/on/server', 'clusternator.com')
        .then(() => C.check(done, () => expect(true).to.be.ok))
        .catch(C.getFail(done));
    });
  });
});
