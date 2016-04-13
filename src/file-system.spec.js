
import * as C from './chai';
import * as rewire from 'rewire';
const fileSystem = rewire('./file-system');

/* global describe, it, expect, beforeEach, afterEach */
describe('File System', () => {
  let oldFs;
  let cbReadFileArgs;
  let cbReadDirArgs;
  let cbStatArgs;

  beforeEach(() => {
    cbReadFileArgs = [];
    cbReadDirArgs = [];
    cbStatArgs = [];
    oldFs = fileSystem.__get__('fs');
    fileSystem.__set__('fs', {
      readdir: (path, cb) => cb.apply(null, cbReadDirArgs),
      readFile: (path, type, cb) => cb.apply(null, cbReadFileArgs),
      stat: (path, cb) => cb.apply(null, cbStatArgs),
    });
  });

  afterEach(() => {
    fileSystem.__set__('fs', oldFs);
  });

  describe('ls function', () => {
    it('should reject if there is an error', (done) => {
      cbReadDirArgs[0] = new Error('test');
      fileSystem.ls()
        .then(C.getFail(done))
        .catch((error) => C
          .check(done, () => expect(error.message).to.equal('test')));
    });

    it('should resolve with data if there is no error', (done) => {
      cbReadDirArgs[0] = null;
      cbReadDirArgs[1] = ['hello'];
      fileSystem.ls()
        .then((data) => C.check(done, () => expect(data).to.deep
          .equal(['hello'])))
        .catch(C.getFail(done));
    });
  });

  describe('readFile function', () => {
    it('should reject if there is an error', (done) => {
      cbReadFileArgs[0] = new Error('test');
      fileSystem.readFile()
        .then(C.getFail(done))
        .catch((error) => C
          .check(done, () => expect(error.message).to.equal('test')));
    });

    it('should resolve with data if there is no error', (done) => {
      cbReadFileArgs[0] = null;
      cbReadFileArgs[1] = { world: 'hello' };
      fileSystem.readFile()
        .then((data) => C.check(done, () => expect(data).to.deep
          .equal({ world: 'hello' })))
        .catch(C.getFail(done));
    });
  });

  describe('loadUserPublicKeys function', () => {
    it('should reject when _not_ given a path', (done) => {
      fileSystem.loadUserPublicKeys()
        .then(C.getFail(done))
        .catch((err) => C
          .check(done, () => expect(err instanceof Error).to.be.ok));
    });

    it('should return an empty array if underlying ls fails', (done) => {
      cbReadDirArgs[0] = new Error('ls failure');
      fileSystem.loadUserPublicKeys('path')
        .then((arr) => C.check(done, () => expect(arr).to.deep.equal([])))
        .catch(C.getFail(done));
    });

    it('should return an empty array if underlying readFile fails', (done) => {
      cbReadFileArgs[0] = new Error('ls failure');
      cbReadDirArgs[0] = null;
      cbReadDirArgs[1] = ['some-key.pub', 'some-other-key.pub'];
      fileSystem.loadUserPublicKeys('path')
        .then((arr) => C.check(done, () => expect(arr).to.deep.equal([])))
        .catch(C.getFail(done));
    });

    it('should resolve readFile\'s results for file in ls\'s results',
      (done) => {
        cbReadFileArgs[0] = null;
        cbReadFileArgs[1] = 'data-thing';
        cbReadDirArgs[0] = null;
        cbReadDirArgs[1] = ['some-key.pub', 'some-other-key.pub'];
        fileSystem.loadUserPublicKeys('path')
          .then((arr) => C.check(done, () => expect(arr).to.deep
            .equal(['data-thing', 'data-thing'])))
          .catch(C.getFail(done));
      });
  });

  describe('decrypt function', () => {
    const cli = {};
    let oldCli;

    beforeEach(() => {
      cli.gpg = {
        decryptWithPassphrase: () => Promise.resolve(),
      };
      cli.rm = {
        rm: () => Promise.resolve(),
        rmrf: () => Promise.resolve(),
      };
      cli.tar = {
        extractGz: () => Promise.resolve(),
      };
      oldCli = fileSystem.__get__('cli');
      fileSystem.__set__('cli', cli);
    });

    afterEach(() => {
      fileSystem.__set__('cli', oldCli);
    });

    it('should resolve even if the file does not exist', (done) => {
      cbStatArgs[0] = new Error('ENOENT');
      fileSystem.decrypt('thing')
        .then(() => C
          .check(done, () => expect(true).to.be.ok))
        .catch(C.getFail(done));
    });

    it('should resolve if its dependent functions resolve', (done) => {
      fileSystem.decrypt('thing')
        .then(() => C
          .check(done, () => expect(true).to.be.ok))
        .catch(C.getFail(done));
    });
  });

  describe('safeReq function', () => {
    it('should reject if a file does not exist', (done) => {
      fileSystem.safeReq('ooaasdg')
        .then(C.getFail(done))
        .catch((e) => C.check(done, () => expect(e instanceof Error).to.be.ok));
    });

    it('should resolve if a file exists', (done) => {
      fileSystem.safeReq('./file-system.spec.js')
        .then((r) => C.check(done, () => expect(r).to.be.ok))
        .catch(C.getFail(done));
    });
  });

  describe('functions that depend on safeReq', () => {
    let oldSafeReq;
    const spies = {};

    beforeEach(() => {
      spies.result = {};
      spies.safeReq = () => Promise.resolve(spies.result);
      oldSafeReq = fileSystem.__get__('safeReq');
      fileSystem.__set__('safeReq', spies.safeReq);
    });

    afterEach(() => {
      fileSystem.__set__('safeReq', oldSafeReq);
    });

    describe('getCredentials function', () => {
      it('should resolve if safeReq resolves', (done) => {
        fileSystem.getCredentials('file', '0.1', 'privatePath', 'us-east')
          .then((r) => C.check(done, () => expect(r).to.be.ok))
          .catch(C.getFail(done));
      });

      it('should normalize SecretAccessKey to secretAccessKey', (done) => {
        spies.result.SecretAccessKey = 'hello';
        fileSystem.getCredentials('file', '0.1', 'privatePath', 'us-east')
          .then((r) => C.check(done, () => expect(r.secretAccessKey).to.be.ok))
          .catch(C.getFail(done));
      });

      it('should normalize AccessKeyId to accessKeyId', (done) => {
        spies.result.AccessKeyId = 'hello';
        fileSystem.getCredentials('file', '0.1', 'privatePath', 'us-east')
          .then((r) => C.check(done, () => expect(r.accessKeyId).to.be.ok))
          .catch(C.getFail(done));
      });
    });

    describe('getClusternatorToken function', () => {
      it('should resolve if safeReq resolves', (done) => {
        spies.result.token = 'hello';
        fileSystem.getClusternatorToken('tokenFileName', 'privatePath')
          .then((r) => C.check(done, () => expect(r).to.equal('hello')))
          .catch(C.getFail(done));
      });

      it('should set result token property to null it does not exist',
        (done) => {
          spies.result.token = undefined;
          fileSystem.getClusternatorToken('tokenFileName', 'privatePath')
            .then((r) => C.check(done, () => expect(r).to.equal(null)))
            .catch(C.getFail(done));
        });
    });

    describe('getConfig function', () => {
      it('should resolve if safeReq resolves', (done) => {
        fileSystem.getConfig('clusternatorJson')
          .then((r) => C.check(done, () => expect(r).to.be.ok))
          .catch(C.getFail(done));
      });
    });

    describe('getAwsConfig function', () => {
      it('should resolve if safeReq resolves', (done) => {
        fileSystem.getAwsConfig('awsFileName', 'privatePath')
          .then((r) => C.check(done, () => expect(r).to.be.ok))
          .catch(C.getFail(done));
      });
    });

    describe('getAppDef function', () => {
      it('should resolve if safeReq resolves', (done) => {
        fileSystem.getAppDef('deploymentsDir', 'deployment')
          .then((r) => C.check(done, () => expect(r).to.be.ok))
          .catch(C.getFail(done));
      });
    });
  });
});
