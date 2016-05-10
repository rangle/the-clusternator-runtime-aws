import * as path from 'path';
import * as constants from './constants';
import * as fileSystem from './file-system';
import * as dockerBuild from './docker-build';
const notify = require('./notify');

const localizePath = (given) => path.normalize('./' + given);

/**
 * @param {Object} config
 * @param {Array.<*>} results
 */
export function assignConfigResults(config, results) {
  //Object.assign(config, c); wtf is this
  let privatePath = localizePath(config.private);

  config.awsConfig = results[0];
  config.clusternatorToken = results[1];
  config.region = config.awsConfig.region;
  config.registryId = config.awsConfig.registryId;
  config.sshPath = path.join(privatePath, constants.SSH_PUBLIC);

  return config;
}

/**
 * @param {Object} config
 * @param {Object} credentials
 * @param {Object} token
 */
export function assignCredentialResults(config, credentials, token) {
  config.credentials = credentials;
  config.tokenObj = token;
  return config;
}

/**
 * @param {{ projectRoot: string, deployment: string,
  deploymentPath: string }} config
 * @returns {Promise.<{}>}
 *
 * WTFFFFF WILL REFACTOR I PROMISE - raf
 */
export function setConfigObject(config) {
  return fileSystem.getConfig(config.projectRoot,
                              constants.CLUSTERNATOR_FILE)
    .then((c) => {

      let priv = localizePath(c.private);
      config.private = priv;

      let deploymentsDir = localizePath(c.deploymentsDir);
      config.deploymentsDir = deploymentsDir;

      return Promise.all([
        fileSystem.getAwsConfig(constants.AWS_FILE, priv),
        fileSystem.getClusternatorToken(
          constants.CLUSTERNATOR_TOKEN, priv),
      ]);
    })
    .then((results) => assignConfigResults(config, results))
    .then((config) => {
      return fileSystem.getCredentials(
            constants.CREDENTIALS_FILE_NAME,
            constants.API_VERSION,
            config.private,
            config.region)
        .then((credentials) => {
          config.credentials = credentials;
          return fileSystem.getClusternatorToken(
            constants.CLUSTERNATOR_TOKEN, config.private)
        })
        .then((token) => {
          config.tokenObj = token; // is this necessary?
          //return assignCredentialResults(config, credentials, token);
        })
        .then(() => {
          return config;
        }); 
      })

    .then((config) => {
      return fileSystem.getAppDef(config.deploymentsDir,
                                  config.deployment)
        .then((appDef) => {
          config.appDef = appDef;
          return config;
        });
    })
    .then(() => {
      console.log('Base configuration okay');
      return config;
    });
}

export function run(projectRoot, host, deployment, isPr) {
  const config = {
    host,
    projectRoot,
    deployment,
    deploymentPath: isPr ?
      constants.PATH_CREATE_PR :
      constants.PATH_CREATE_DEPLOYMENT,
  };

  return setConfigObject(config)
    .then((c) => {
      console.log('FINAL CONFIG', c); // eslint-disable-line
      return dockerBuild.main(config)
        .then((d) => {
          console.log(d);
          return notify(c.appDef, c.projectId,
            c.clusternatorToken, c.fullImageName, c.keys,
            deploymentPath, deployment);
        });
    }, (err) => {
      console.log('err', err.stack); // eslint-disable-line
    });
}
