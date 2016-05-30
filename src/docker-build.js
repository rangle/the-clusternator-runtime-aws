import * as constants from './constants';
import * as env from './environment';
import * as fileSystem from './file-system';
const path = require('path');
const AWS = require('aws-sdk');
const log = require('./log').log;
const cli = require('./child-processes');

const decrypt = fileSystem.decrypt
  .bind(null, constants.TARBALL, constants.TARBALL_ENCRYPTED);


export function main(config) {
  return getAwsEcrToken(config.credentials, config.registryId)
    .then((tokenObj) => {
      const imageName =
        buildImageName(config.projectId, config.deployment);
      return login(tokenObj)
        .then(() => fileSystem.rmrf(config.private))
        .then(() => dockerBuild(imageName, config.projectRoot))
        .then(() => dockerTag(tokenObj.proxyEndpoint, imageName))
        .then((fullImageName) => dockerPush(fullImageName)
          .then(() => {
            return fileSystem.decrypt(constants.TARBALL,
                                      constants.TARBALL_ENCRYPTED,
                                      env.sharedKey())
          })
          .then(() => {
            return fileSystem.loadUserPublicKeys(config.sshPath)
          })
          .then((keys) => {
            config.keys = keys;
            config.fullImageName = fullImageName;

            return {
              keys,
              fullImageName
            };
          }));
    })
    .catch((err) => {
      log(`Docker Build Error: ${err.message}`);
      log(`Docker Build Error: ${err.stack}`);
      process.exit(1);
    });
}


/**
 * @param {string} projectId
 * @param {string} deployment
 * @returns {string}
 */
function buildImageName(projectId, deployment) {
  const PR = env.prNumber();
  const BUILD = env.buildNumber();
  if (deployment === 'pr') {
    return `${constants.CLUSTERNATOR_PREFIX}${projectId}:pr-${PR}-${BUILD}`;
  }
  return `${constants.CLUSTERNATOR_PREFIX}${projectId}:deploy-${BUILD}`;
}

/**
 * @param {Object} creds
 * @param {string} registryId
 * @returns {Promise}
 */
function getAwsEcrToken(creds, registryId) {
  const ecr = new AWS.ECR(creds);

  return new Promise((resolve, reject) => {
    ecr.getAuthorizationToken({
      registryIds: [registryId],
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (!result.authorizationData[0]) {
        reject(new Error('no AWS authorization data returned'));
        return;
      }
      resolve(result.authorizationData[0]);
    });
  });
}

/**
 * @param {string} data (base64 data)
 * @returns {{user: string, token: string}}
 */
function decodeToken(data) {
  const decoded = new Buffer(data.authorizationToken, 'base64')
    .toString('utf8').split(':');
  return {
    user: decoded[0],
    token: decoded[1],
  };
}

/**
 * @param {{ token: string, proxyEndpoint: string }} data
 * @return {Promise<{ token: string, proxyEndpoint: string }>}
 */
function login(data) {
  const decoded = decodeToken(data);
  const end = data.proxyEndpoint;
  return cli.docker.login(decoded.user, decoded.token, end);
}


/**
 * @param {string} endPoint
 * @returns {string}
 */
function cleanEndPoint(endPoint) {
  if (endPoint.indexOf('https://') === 0) {
    return endPoint.slice(8);
  }
  return endPoint;
}

function makeFullName(endPoint, imageName) {
  return `${cleanEndPoint(endPoint)}/${imageName}`;
}

/**
 * @param {string} endPoint
 * @param {string} imageName
 * @returns {Promise}
 */
function dockerTag(endPoint, imageName) {
  const target = makeFullName(endPoint, imageName);
  return cli.docker.tag(imageName, target)
    .then(() => target);
}

/**
 * @param {string} fullImageName
 * @returns {Promise}
 */
function dockerPush(fullImageName) {
  return cli.docker.push(fullImageName);
}

/**
 * @param {string} imageName
 * @return {Promise}
 */
function dockerBuild(imageName, root) {
  const cwd = process.cwd();
  return cli.docker.build(imageName, root)
    .then(() => process.chdir(cwd));
}

