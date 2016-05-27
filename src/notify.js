//import * as http from 'https';
import * as http from 'http';
import * as constants from './constants';
import * as logger from './log';
import * as env from './environment';

const log = logger.log;


function substituteAppDefImage(appDef, image) {
  appDef.tasks[0].containerDefinitions[0].image = image;
  return appDef;
}

/**
 * @param {string} appDef
 * @param {string} projectId
 * @param {string} key
 * @param {string} image
 * @param {Array.<string>} sshKeys
 * @param {string} serverPath
 * @param {string} deployment
 * @param {string} host
 * @returns {Promise}
 */
export function notify(appDef, projectId, key, image, sshKeys, serverPath,
                       deployment, host) {

  const clusternatorHost = host;
  const pr = env.prNumber();
  const build = env.buildNumber();
  const repo = projectId;
  const subbedAppDef = substituteAppDefImage(appDef, image);

  const dataObj = {
    pr,
    deployment,
    build,
    repo,
    sshKeys,

    appDef: subbedAppDef
  };

  // Build the post string from an object
  const data = JSON.stringify(dataObj);

  return post(data, key, serverPath, clusternatorHost);
}

export function post(data, auth, serverPath, clusternatorHost) {

  // An object of options to indicate where to post to
  const postOptions = {
    host: clusternatorHost,
    //port: constants.PORT,
    port: 9090,
    path: serverPath,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'Authorization': 'Token ' + auth,
    }
  };

  log('Posting To:', clusternatorHost);
  log('Posting with options:', postOptions);

  return new Promise((resolve, reject) => {
    // Set up the request
    const postReq = http.request(postOptions, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        log('Response: ' + chunk);
        resolve();
      });

      res.on('error', (err) => {
        log('Error response:', err);
        reject();
      });
    });

    // post the data
    postReq.write(data);
    postReq.end();
  });
}

