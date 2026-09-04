import {authenticator} from 'otplib';
import {axiosRequest} from './ApiHelper.ts';
import {readCache, writeCache} from './TokenCachingHelper.ts';

const env = process.env.RUNNING_ENV?.startsWith('pr-') ? 'aat' : (process.env.RUNNING_ENV || 'aat');
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;

export async function getUserToken(username: string, password: string): Promise<string> {
  const tokenCache = await readCache();
  const cached = tokenCache.get(username);
  const now = Date.now();
  if (cached && cached.expiry > now) {
    return cached.token;
  }

  const idamClientSecret = process.env.IDAM_CLIENT_SECRET;

  const idamTokenResponse = await axiosRequest({
    method: 'post',
    url: `${idamBaseUrl}/o/token`,
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

  tokenCache.set(username,
    {
      token: idamTokenResponse.data.access_token,
      expiry: idamTokenResponse.data.expires_in * 1000 + now - 60000,
      userId: cached?.userId ?? ''
    }
  );

  await writeCache(tokenCache);

  return idamTokenResponse.data.access_token;
}

export async function getUserId(authToken: string, username: string): Promise<string> {
  const tokenCache = await readCache();
  const cached = tokenCache.get(username);
  if (cached?.userId) {
    return cached.userId;
  }

  const idamDetailsPath = '/details';

  const userDetailsResponse = await axiosRequest({
    method: 'get',
    url: idamBaseUrl + idamDetailsPath,
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (cached) {
    cached.userId = userDetailsResponse.data.id;
    tokenCache.set(username, cached);
  } else {
    tokenCache.set(username,
      {
        token: authToken,
        expiry: 0,
        userId: userDetailsResponse.data.id
      }
    );
  }
  await writeCache(tokenCache);
  return userDetailsResponse.data.id;
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
