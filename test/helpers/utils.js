const { Logger } = require('@hmcts/nodejs-logging');
const axios = require('axios')
const axiosInstance = axios.create({});

const date = require('moment');

const fs = require('fs');
const { response } = require('express');

const logger = Logger.getLogger('helpers/utils.js');

const env = process.env.RUNNING_ENV || 'aat';

async function axiosRequest(requestParams) {
  return await axiosInstance(requestParams).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
  });
}

async function getUserToken(username, password) {
  logger.info('Getting User Token');
  const redirectUri = `https://div-pfe-${env}.service.core-compute-${env}.internal/authenticated`;
  const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
  const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;
  const idamCodePath = `/oauth2/authorize?response_type=code&client_id=divorce&redirect_uri=${redirectUri}`;

  const idamCodeResponse = await axiosRequest({
    method: 'post',
    url: idamBaseUrl + idamCodePath,
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }});

  console.log("Successfully retired idam code")

  const idamAuthPath = `/oauth2/token?grant_type=authorization_code&client_id=divorce&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&code=${idamCodeResponse.data.code}`;

  const authTokenResponse = await axiosRequest({
    method: 'post',
    url: idamBaseUrl + idamAuthPath,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  console.log("Successfully retired user token")

  return authTokenResponse.data.access_token;
}

async function getUserId(authToken) {
  logger.info('Getting User Id');

  const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;

  const idamDetailsPath = '/details';
  const userDetails = await axiosInstance.get(idamBaseUrl + idamDetailsPath, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  logger.debug(userDetails).id;

  return userDetails.id;
}

async function getServiceToken() {
  logger.info('Getting Service Token');

  const serviceSecret = process.env.CCD_SUBMIT_S2S_SECRET;

  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/lease';
  // eslint-disable-next-line global-require
  const oneTimePassword = require('otp')({ secret: serviceSecret }).totp();

  const serviceToken = await axiosInstance({
    method: 'POST',
    uri: s2sBaseUrl + s2sAuthPath,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      microservice: 'divorce_ccd_submission',
      oneTimePassword
    })
  });

  logger.debug(serviceToken);

  return serviceToken;
}

async function createCaseInCcd(userName, password, dataLocation, caseType, eventId) {
  const authToken = await getUserToken(userName, password);

  const userId = await getUserId(authToken);

  const serviceToken = await getServiceToken();

  logger.info('Creating Case');

  const ccdApiUrl = process.env.CCD_DATA_API_URL;
  const frCaseType = caseType;
  const frEventId = eventId;
  const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/event-triggers/${frEventId}/token`;
  const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/cases`;

  const startCaseOptions = {
    method: 'GET',
    uri: ccdApiUrl + ccdStartCasePath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };

  const startCaseResponse = await axiosInstance(startCaseOptions);
  const eventToken = startCaseResponse.token;
  /* eslint id-blacklist: ["error", "undefined"] */
  const data = fs.readFileSync(dataLocation);
  const saveBody = {
    data: JSON.parse(data),
    event: {
      id: `${frEventId}`,
      summary: 'Creating Basic Case',
      description: 'For CCD E2E Test'
    },
    event_token: eventToken
  };

  const saveCaseOptions = {
    method: 'POST',
    uri: ccdApiUrl + ccdSaveCasePath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const saveCaseResponse = await axiosInstance(saveCaseOptions).catch(error => {
    console.log(error);
  });

  const caseId = saveCaseResponse.id;

  logger.info('Created case with id %s', caseId);

  return caseId;
}

async function updateCaseInCcd(userName, password, caseId, caseType, eventId, dataLocation,shareCaseRef) {
  const authToken = await getUserToken(userName, password);

  const userId = await getUserId(authToken);

  const serviceToken = await getServiceToken();

  logger.info('Updating case with id %s and event %s', caseId, eventId);

  const ccdApiUrl = process.env.CCD_DATA_API_URL;
  const frCaseType = caseType;
  const ccdStartEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/cases/${caseId}/event-triggers/${eventId}/token`;
  const ccdSaveEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${frCaseType}/cases/${caseId}/events`;

  const startEventOptions = {
    method: 'GET',
    uri: ccdApiUrl + ccdStartEventPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };

  const startEventResponse = await axiosInstance(startEventOptions);

  const eventToken = startEventResponse.token;

  const data = fs.readFileSync(dataLocation);
  let updatedData = JSON.stringify(JSON.parse(data));
  updatedData = updatedData.replace("ReplaceForShareCase",shareCaseRef);
  const saveBody = {
    data: JSON.parse(updatedData),
    event: {
      id: eventId,
      summary: 'Updating Case',
      description: 'For CCD E2E Test'
    },
    event_token: eventToken
  };

  const saveEventOptions = {
    method: 'POST',
    uri: ccdApiUrl + ccdSaveEventPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const saveEventResponse = await axiosInstance(saveEventOptions);

  return saveEventResponse;
}

function createSolicitorReference() {
  return date().valueOf();
}

function createCaseworkerReference() {
  return 'CA' + date().valueOf();
}

module.exports = { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference };
