import * as logger from './log';

const log = logger.log;

/**
 * @param {Object} appDef
 * @param {string} key
 * @param {string} host
 * @param {string} repo
 * @param {string} pr
 * @param {string} image
 * @param {string} deployment
 */
export function populateAppDef(appDef, key, host, repo, pr, image, deployment) {
  log('Loading Application Definition');
  appDef.tasks[0].containerDefinitions[0].environment.push({
    name: 'PASSPHRASE',
    value: key,
  });
  if (deployment === 'pr') {
    const hostname = `${repo}-pr-${pr}.${host}`;
    appDef.tasks[0].containerDefinitions[0].hostname = hostname;
    appDef.tasks[0].containerDefinitions[0].environment.push({
      name: 'HOST',
      value: hostname,
    });
  } else if (deployment === 'master') {
    const hostname = `${repo}.${host}`;
    appDef.tasks[0].containerDefinitions[0].hostname = hostname;
    appDef.tasks[0].containerDefinitions[0].environment.push({
      name: 'HOST',
      value: hostname,
    });
  } else {
    const hostname = `${repo}-${deployment}.${host}`;
    appDef.tasks[0].containerDefinitions[0].hostname = hostname;
    appDef.tasks[0].containerDefinitions[0].environment.push({
      name: 'HOST',
      value: hostname,
    });
  }
  appDef.tasks[0].containerDefinitions[0].image = image;
  return JSON.stringify(appDef);
}

