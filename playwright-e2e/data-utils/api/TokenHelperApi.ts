import {authenticator} from 'otplib';
import {axiosRequest} from './ApiHelper.ts';
import {readCache, writeCache} from './TokenCachingHelper.ts';

const env = process.env.RUNNING_ENV && process.env.RUNNING_ENV.startsWith('pr-') ? 'aat' : (process.env.RUNNING_ENV || 'aat');
const idamOidcBaseUrl = `https://idam-web-public.${env}.platform.hmcts.net`;

export async function getUserToken(username: string, password: string): Promise<string> {
  const tokenCache = await readCache();
  const cached = tokenCache.get(username);
  const now = Date.now();

  if (cached && cached.expiry > now && cached.userId) {
    return cached.token;
  }

  const idamClientSecret = process.env.IDAM_CLIENT_SECRET;

  const idamTokenResponse = await axiosRequest({
    method: 'post',
    url: `${idamOidcBaseUrl}/o/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      client_id: 'divorce',
      client_secret: idamClientSecret!,
      scope: 'openid profile roles'
    }).toString()
  });

  const idToken = idamTokenResponse.data.id_token;

  if (!idToken) {
    throw new Error('IDAM token response did not contain an id_token');
  }

  const payloadPart = idToken.split('.')[1];

  if (!payloadPart) {
    throw new Error('Invalid ID token: JWT payload is missing');
  }

  const decodedPayload = JSON.parse(
    Buffer.from(payloadPart, 'base64url').toString('utf8')
  );

  if (!decodedPayload.uid) {
    throw new Error('User ID not found in ID token');
  }

  tokenCache.set(username, {
    token: idamTokenResponse.data.access_token,
    expiry: idamTokenResponse.data.expires_in * 1000 + now - 60000,
    userId: String(decodedPayload.uid)
  });

  await writeCache(tokenCache);

  return idamTokenResponse.data.access_token;
}

export async function getUserId(username: string): Promise<string> {
  const tokenCache = await readCache();
  const cached = tokenCache.get(username);

  if (!cached?.userId) {
    throw new Error(`User ID not found for ${username}`);
  }

  return cached.userId;
}

export async function getServiceToken(): Promise<string> {
  const tokenCache = await readCache();
  const cached = tokenCache.get('finrem-service-token');
  const now = Date.now();
  if (cached && cached.expiry > now) {
    return cached.token;
  }

  const serviceSecret = process.env.FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY || '';
  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/lease';

  const oneTimePassword = authenticator.generate(serviceSecret);

  const serviceTokenResponse = await axiosRequest({
    url: s2sBaseUrl + s2sAuthPath,
    method: 'post',
    data: {
      microservice: 'finrem_case_orchestration',
      oneTimePassword
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  tokenCache.set('finrem-service-token',
    {
      token: serviceTokenResponse.data,
      expiry: 1000 * getJwtExpiry(serviceTokenResponse.data) + now - 60000,
      userId: ''
    }
  );
  await writeCache(tokenCache);
  return serviceTokenResponse.data;
}

export function getJwtExpiry(token: string): number {
  const payload = token.split('.')[1];
  if (!payload) return 0;
  const decoded = Buffer.from(payload, 'base64').toString('utf8');
  try {
    const { exp } = JSON.parse(decoded);
    return exp; // This is in seconds since epoch
  } catch {
    return 0;
  }
}
