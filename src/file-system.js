import * as fs from 'fs';
import * as path from 'path';
import * as cli from './child-processes';
import * as log from './log';

export const rmrf = cli.rm.rmrf;

/**
 * @param {string} localPath
 * @returns {Promise.<Array.<string>>}
 */
export function ls(localPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(localPath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * @param {string} localPath
 * @returns {Promise}
 */
export function readFile(localPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(localPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * @param {string} filePath
 * @param {string} fileName
 * @returns {Promise}
 */
export function mapReadFile(filePath, fileName) {
  return readFile(path.join(filePath, fileName));
}

/**
 * Loads _all_ the contents of a given path, it assumes they're public keys
 * @param {string} keyPath
 * @returns {Promise<string[]>}
 */
export function loadUserPublicKeys(keyPath) {
  if (!keyPath) {
    return Promise.reject(
      new TypeError('requires a path to the keys directory')
    );
  }
  const mapReadKeyFile = mapReadFile.bind(null, keyPath);
  return ls(keyPath)
    .then((keyFiles) => Promise
      .all(keyFiles.map(mapReadKeyFile)))
    .catch(() => []);
}

/**
 * @param {string} somePath
 * @returns {Promise|Promise<T>}
 */
export function pathExists(somePath) {
  return new Promise((resolve, reject) => {
    fs.stat(somePath, (err) => err ? reject(err) : resolve());
  });
}

/**
 * @param {string} pathToTarball
 * @param {string} pathToTarballEncrypted
 * @param {string} passPhrase
 * @returns {Promise}
 */
export function decrypt(pathToTarball, pathToTarballEncrypted, passPhrase) {
  return pathExists(pathToTarballEncrypted)
    .then(() => cli.gpg
      .decryptWithPassphrase(
        passPhrase, pathToTarball, pathToTarballEncrypted)
      .then(() => cli.tar.extractGz(pathToTarball)
        .then(() => cli.rm.rm(pathToTarball))),
      () => log.log('Nothing to decrypt, skipping'));
}

/**
 * @param {string} localPath
 * @param {string=} label
 * @returns {Promise.<*>}
 * exits
 */
export function safeReq(localPath, label) {
  return new Promise((resolve, reject) => {
    try {
      resolve(require(localPath));
    } catch (err) {
      reject(new Error(`Error loading ${label}: ${err.message}`));
    }
  });
}

/**
 * @param {string} fileName credential file
 * @param {string} apiVersion
 * @param {string} privatePath
 * @param {string} region
 * @returns {Promise.<{ secretAccessKey: string, accessKeyId: string,
 region: string, apiVersion: string }>}
 */
export function getCredentials(fileName, apiVersion, privatePath, region) {
  return readJSON(path.join(privatePath, fileName + '.json'), fileName)
    .then((creds) => {
      creds.secretAccessKey = creds.secretAccessKey || creds.SecretAccessKey;
      creds.accessKeyId = creds.accessKeyId || creds.AccessKeyId;
      creds.region = region;
      creds.apiVersin = apiVersion;

      return creds;
    });
}

/**
 * @param {string} tokenFileName
 * @param {string} privatePath
 * @returns {Promise.<*>}
 */
export function getClusternatorToken(tokenFileName, privatePath) {
  return readJSON(path.join(privatePath, tokenFileName), tokenFileName)
      .then((result) => result.token || null);
}

/**
 * @param {string} clusternatorFileName
 * @returns {Promise.<*>}
 */
export function getConfig(root, clusternatorFileName) {
  let p = path.resolve(root, clusternatorFileName);
  return readJSON(p);
}

/**
 * @param {string} awsFileName
 * @param {string} privatePath
 * @returns {Promise.<*>}
 */
export function getAwsConfig(awsFileName, privatePath) {
  return readJSON(path.join(privatePath, awsFileName), awsFileName);
}

/**
 * @param {string} deploymentsDir
 * @param {string} deployment
 * @returns {Promise.<*>}
 */
export function getAppDef(deploymentsDir, deployment) {
  const appDefPath = path.join(deploymentsDir, deployment + '.json');
  return pathExists(appDefPath)
    .then(() => readJSON(appDefPath));
}

export function readJSON(localPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(localPath, (err, data) => {
      let d = JSON.parse(data);
      if (err) {
        reject(err);
      } else {
        resolve(d);
      }
    });
  });
}
