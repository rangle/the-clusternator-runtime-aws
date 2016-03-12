'use strict';

const dockerBuild = require('./docker-build');

module.exports = {
  main
};

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

/**
 * @param {number} pos
 * @returns {{PATH: string, DEPLOYMENT: string}}
 */
function getDeploymentInfo(pos) {
  let DEPLOYMENT;
  let PATH;

  if (getArg(pos) === 'deploy') {
    PATH = '/0.1/deployment/create';
    if (process.argv[pos + 1] && process.argv[pos + 1].trim()) {
      DEPLOYMENT = process.argv[pos + 1].trim();
    } else {
      DEPLOYMENT = 'master';
    }
  } else {
    PATH = '/0.1/pr/create';
    DEPLOYMENT = 'pr';
  }

  return {
    PATH,
    DEPLOYMENT
  }
}

/**
 * @param {number} pos
 * @returns {string}
 */
function getHost(pos) {
  return process.argv[pos] ? process.argv[pos].trim() + '' : '';
}

function usage() {
  console.log('');
  console.log(`Usage: ${process.argv[0]} <host> <deploymentType> ` +
    '[<deploymentName>]');
  console.log('');
}

function main_() {
  const deploymentInfo = getDeploymentInfo(3);
  const host = getHost(2);

  if (!host) {
    console.log('Invalid Host:', process.argv[2]);
    usage();
    process.exit(1);
  }

  dockerBuild.main(host, deploymentInfo);
}

function main() {
  try {
    main_();
  } catch (err) {
    usage();
    console.log('');
    console.log(err.message);
    console.log('');
  }
}
