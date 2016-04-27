import * as constants from './constants';
import * as runtime from './main';
import * as l from './log';


const log = l.log;

/**
 * @param {number} pos
 * @returns {string}
 */
function getArg(pos) {
  if (process.argv[pos] === undefined) {
    throw new TypeError('usage error');
  }
  return process.argv[pos].trim();
}

function usage() {
  log('');
  log(`Usage: ${process.argv[0]} <projectRoot> <host> <deploymentType>`);
  log('[<deploymentName>]');
  log('');
}

function main_() {
  const deploymentInfo = getDeploymentInfo(4);
  const host = getHost(3);
  const projectRoot = getProjectRoot(2);

  if (!host) {
    log('Invalid Host:', process.argv[2]);
    usage();
    process.exit(1);
  }

  runtime.run(projectRoot, host, deploymentInfo.deployment,
    deploymentInfo.isPr);
}

export function main() {
  try {
    main_();
  } catch (err) {
    usage();
    log('');
    log(err.message);
    log('');
  }
}
/**
 * @param {number} pos
 * @returns {string}
 */
export function getHost(pos) {
  return process.argv[pos] ? process.argv[pos].trim() + '' : '';
}


/**
 * @param {number} pos expects argsv pos and pos +1
 * @returns {{ DEPLOYMENT: string, isPr: boolean  }}
 */
export function getDeploymentInfo(pos) {
  let deployment;
  let isPr = false;

  if (getArg(pos) === constants.FLAG_DEPLOY) {
    if (process.argv[pos + 1] && process.argv[pos + 1].trim()) {
      deployment = process.argv[pos + 1].trim();
    } else {
      deployment = constants.DEFAULT_DEPLOYMENT;
    }
  } else {
    deployment = constants.FLAG_PR;
    isPr = true;
  }

  return {
    deployment,
    isPr,
  };
}

