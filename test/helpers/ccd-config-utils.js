const request = require('request-promise-native');
const fs = require('fs');
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('helpers/utils.js');
const env = process.env.RUNNING_ENV || 'aat';
// For local dev env testing use
// const ccdDefinitionStoreBaseUrl = `http://localhost:4451`;
const ccdDefinitionStoreBaseUrl = `http://ccd-definition-store-api-${env}.service.core-compute-${env}.internal`;

function getServiceToken() {
  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/testing-support/lease';

  return request({
    method: 'POST',
    uri: s2sBaseUrl + s2sAuthPath,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ microservice: 'ccd_gw' })
  });
}

async function getAuthToken(username, password) {
  const idamUrl = `https://idam-api.${env}.platform.hmcts.net`;
  const clientSecret = process.env.FINREM_IDAM_CLIENT_SECRET;
  const redirectUri = 'http://localhost:3451/oauth2redirect';
  const clientId = 'finrem';

  const uri = idamUrl.concat('/o/token',
    `?client_id=${clientId}`,
    `&client_secret=${clientSecret}`,
    `&redirect_url=${redirectUri}`,
    `&username=${username}`,
    `&password=${password}`,
    '&scope=openid profile roles',
    '&grant_type=password');
  const encodedUri = encodeURI(uri);

  const response = await request({
    method: 'POST',
    uri: encodedUri,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }
  })
    .catch(error => {
      logger.error(error);
    });

  return JSON.parse(response).access_token;
}

function createCcdRole(role, serviceToken, userToken) {
  logger.info(`Creating role ${role.role}`);

  return request.put({
    uri: `${ccdDefinitionStoreBaseUrl}/api/user-role`,
    headers: {
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(role)
  }
  ).catch(error => {
    logger.info(`Error creating role ${role.role}: ${error.statusCode}`);
  });
}

async function createCcdRoles(username, password) {
  logger.info('Creating CCD roles');

  const ccdRolesJson = fs.readFileSync('./test/data/ccd-roles.json');
  const ccdRoles = JSON.parse(ccdRolesJson);
  const authToken = await getAuthToken(username, password);
  const serviceToken = await getServiceToken();

  return Promise.all(ccdRoles.map(role => {
    return createCcdRole(role, serviceToken, authToken);
  }));
}

async function importCcdConfig(username, password, file) {
  logger.info(`Importing ${file}`);

  const authToken = await getAuthToken(username, password);
  const serviceToken = await getServiceToken();

  return request.post({
    uri: `${ccdDefinitionStoreBaseUrl}/import`,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'multipart/form-data'
    },
    formData: { file: fs.createReadStream(file) }
  }
  ).catch(error => {
    logger.info(`Error importing ${file}: ${error.statusCode}`);
  });
}

module.exports = { createCcdRoles, importCcdConfig };
