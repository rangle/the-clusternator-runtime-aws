import * as constants from './constants';
import * as fileSystem from './file-system';
import * as dockerBuild from './docker-build';
const notify = require('./notify');

const localizePath = (given) => path.normalize('../' + given);

/**
 * @param {Object} config
 * @param {Array.<*>} results
 */
export function assignConfigResults(config, results) {
  Object.assign(config, c);
  config.awsConfig = results[0];
  config.clusternatorToken = results[1];
  config.privatePath = localizePath(c.privatePath);
  config.regiion = config.awsConfig.region;
  config.registryId = config.awsConfig.registryId;
  config.sshPath = path.join(privatePath, constants.SSH_PUBLIC);
}

/**
 * @param {Object} config
 * @param {Object} credentials
 * @param {Object} token
 */
export function assignCredentialResults(config, credentials, token) {
  config.credentials = credentials;
  config.tokenObj = token;
}

/**
 * @param {{ projectRoot: string, deployment: string,
  deploymentPath: string }} config
 * @returns {Promise.<{}>}
 */
export function setConfigObject(config) {
  return fileSystem.getConfig(constants.CLUSTERNATOR_FILE)
    .then((c) => Promise.all([
      fileSystem.getAwsConfig(constants.AWS_FILE, localizePath(c.privatePath)),
      fileSystem.getClusternatorToken(
        constants.CLUSTERNATOR_TOKEN, localizePath(c.privatePath)),
    ]))
    .then((results) => assignConfigResults(config, results))
    .then(() => fileSystem.getCredentials(
      constants.CREDENTIALS_FILE_NAME,
      constants.API_VERSION,
      config.privatePath,
      config.region)
      .then((credentials) => fileSystem.getClusternatorToken(
        constants.CLUSTERNATOR_TOKEN, config.privatePath)
        .then((token) => assignCredentialResults(config, credentials, token))))
    .then(() => fileSystem.getAppDef(
      localizePath(config.deploymentsDir), config.deployment)
      .then((appDef) => { config.appDef = appDef; }))
    .then(() => {
      log('Base configuration okay');
      return config;
    });
}

export function run(projectRoot, deployment, isPr) {
  const config = {
    projectRoot,
    deployment,
    deploymentPath: isPr ?
      constants.PATH_CREATE_PR :
      constants.PATH_CREATE_DEPLOYMENT,
  };

  return setConfigObject(config)
    .then(() => dockerBuild.main(config))
    .then(() => notify(config.appDef, config.projectId,
      config.clusternatorToken, config.fullImageName, config.keys,
      deploymentPath, deployment, ));
}
