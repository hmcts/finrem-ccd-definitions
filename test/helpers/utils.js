const { Logger } = require('@hmcts/nodejs-logging');
const axios = require('axios');
const date = require('moment');
const fs = require('fs');

const logger = Logger.getLogger('helpers/utils.js');
const axiosClient = axios.create({});

const env = process.env.RUNNING_ENV || 'aat';
const ccdApiUrl = process.env.CCD_DATA_API_URL;
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;


async function axiosRequest(requestParams) {
  return await axiosClient(requestParams).then(response => {
    return response;
  }).catch(error => {
    logger.error('Utils %s request error %s', requestParams.url, error.message);
  });
}

async function getUserToken(username, password) {
  logger.info('Getting User Token');

  const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
  const redirectUri = `https://div-pfe-${env}.service.core-compute-${env}.internal/authenticated`;
  const idamCodePath = `/oauth2/authorize?response_type=code&client_id=divorce&redirect_uri=${redirectUri}`;

  const idamCodeResponse = await axiosRequest({
    method: 'post',
    url: idamBaseUrl + idamCodePath,
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }}).then(
    logger.info('Successfully retrieved IdAM code')
  );

  const idamAuthPath = `/oauth2/token?grant_type=authorization_code&client_id=divorce&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&code=${idamCodeResponse.data.code}`;

  const authTokenResponse = await axiosRequest({
    method: 'post',
    url: idamBaseUrl + idamAuthPath,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(
    logger.info('Successfully retrieved user token')
  );

  return authTokenResponse.data.access_token;
}

async function getUserId(authToken) {
  logger.info('Getting User Id');

  const idamDetailsPath = '/details';

  const userDetailsResponse = await axiosRequest({
    method: 'get',
    url: idamBaseUrl + idamDetailsPath,
    headers: { Authorization: `Bearer ${authToken}` }
  }).then(
    logger.info('Successfully retrieved User ID')
  );

  return userDetailsResponse.data.id;
}

async function getServiceToken() {
  logger.info('Getting Service Token');

  const serviceSecret = process.env.CCD_SUBMIT_S2S_SECRET;
  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/lease';
   
  const oneTimePassword = require('otp')({ secret: serviceSecret }).totp();

  const serviceTokenResponse = await axiosRequest({
    url: s2sBaseUrl + s2sAuthPath,
    method: 'post',
    data: {
      microservice: 'divorce_ccd_submission',
      oneTimePassword: oneTimePassword
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(
    logger.info('Successfully retrieved service token')
  );

  return serviceTokenResponse.data;
}

async function getStartEventToken(ccdStartCasePath, ccdSaveCasePath, authToken, serviceToken) {
  logger.info('Retrieving start event token');

  const startCaseResponse = await axiosRequest({
    method: 'get',
    url: ccdApiUrl + ccdStartCasePath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  }).then(
    logger.info('Successfully retrieved start event token')
  );

  return startCaseResponse.data.token;
}

async function saveCase(ccdSaveCasePath, authToken, serviceToken, payload) {
  logger.info('Saving Case');
  return await axiosRequest({
    url: ccdApiUrl + ccdSaveCasePath,
    method: 'post',
    data: payload,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  }).then(
    logger.info('Successfully saved case')
  );
}

async function createCaseInCcd(userName, password, dataLocation, caseType, eventId, dataModifications = []) {
  const authToken = await getUserToken(userName, password);
  const userId = await getUserId(authToken);
  const serviceToken = await getServiceToken();

  logger.info('Creating Case');

  const frCaseType = caseType;
  const frEventId = eventId;
  const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/event-triggers/${frEventId}/token`;
  const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/cases`;

  const eventToken = await getStartEventToken(ccdStartCasePath, ccdSaveCasePath, authToken, serviceToken);
  /* eslint id-blacklist: ["error", "undefined"] */
  const data = JSON.parse(fs.readFileSync(dataLocation));

  if (Array.isArray(dataModifications)) {
    dataModifications.forEach(modification => {
      if (modification.action === 'delete' && modification.key) {
        delete data[modification.key];
      } else if (modification.action === 'insert' && modification.key && modification.value) {
        data[modification.key] = modification.value;
      }
    });
  }

  const payload = {
    data: data,
    event: {
      id: `${frEventId}`,
      summary: 'Creating Basic Case',
      description: 'For CCD E2E Test'
    },
    event_token: eventToken
  };

  const saveCaseResponse = await saveCase(ccdSaveCasePath, authToken, serviceToken, payload);
  const caseId = saveCaseResponse.data.id;
  logger.info('Created case with id %s', caseId);

  return caseId;
}

async function updateCaseInCcd(userName, password, caseId, caseType, eventId, dataLocation, shareCaseRef) {
  const authToken = await getUserToken(userName, password);
  const userId = await getUserId(authToken);
  const serviceToken = await getServiceToken();

  logger.info('Updating case with id %s and event %s', caseId, eventId);

  const frCaseType = caseType;
  const ccdStartEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/cases/${caseId}/event-triggers/${eventId}/token`;
  const ccdSaveEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/cases/${caseId}/events`;

  const eventToken = await getStartEventToken(ccdStartEventPath, ccdSaveEventPath, authToken, serviceToken);

  const data = fs.readFileSync(dataLocation);
  let updatedData = JSON.stringify(JSON.parse(data));
  updatedData = updatedData.replace('ReplaceForShareCase', shareCaseRef);

  const payload =  {
    data: JSON.parse(updatedData),
    event: {
      id: `${eventId}`,
      summary: 'Updating Case',
      description: 'For CCD E2E Test'
    },
    event_token: eventToken
  };

  const saveCaseResponse = await saveCase(ccdSaveEventPath, authToken, serviceToken, payload);
  logger.info('Updated case with id %s and event %s', caseId, eventId);
  return saveCaseResponse.data;
}

function createSolicitorReference() {
  return date().valueOf();
}

function createCaseworkerReference() {
  return 'CA' + date().valueOf();
}

module.exports = { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference };
