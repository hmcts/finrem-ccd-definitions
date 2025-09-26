import {authenticator} from "otplib";
import {axiosRequest} from "./ApiHelper.ts";
import {ApiCounter} from "./ApiCounter.ts";

const env = process.env.RUNNING_ENV && process.env.RUNNING_ENV.startsWith("pr-") ? "aat" : (process.env.RUNNING_ENV || "aat");
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;

type CachedToken = {
    token: string;
    expiry: number;
    userId: string;
};

const tokenCache: Map<string, CachedToken> = new Map<string, CachedToken>();

export async function getUserToken(username: string, password: string): Promise<string> {
    const cached = tokenCache.get(username);
    const now = Date.now();
    if (cached && cached.expiry > now) {
        return cached.token;
    }

    const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
    const redirectUri = `https://div-pfe-${env}.service.core-compute-${env}.internal/authenticated`;
    const idamCodePath = `/oauth2/authorize?response_type=code&client_id=divorce&redirect_uri=${redirectUri}`;
    await ApiCounter.incrementIdamCodeApiCall();
    const idamCodeResponse = await axiosRequest({
        method: "post",
        url: idamBaseUrl + idamCodePath,
        headers: {
            Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const idamAuthPath = `/oauth2/token?grant_type=authorization_code&client_id=divorce&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&code=${idamCodeResponse.data.code}`;

    await ApiCounter.incrementIdamApiCall();
    const authTokenResponse = await axiosRequest({
        method: "post",
        url: idamBaseUrl + idamAuthPath,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    tokenCache.set(username,
      {
        token: authTokenResponse.data.access_token,
        expiry: authTokenResponse.data.expires_in * 1000 + now - 60000,
        userId: cached?.userId ?? ""
        }
    );
    return authTokenResponse.data.access_token;
}

export async function getUserId(authToken: string, userName: string): Promise<string> {
    const cached = tokenCache.get(userName);
    if ( cached && cached.userId) {
        return cached.userId;
    }

    const idamDetailsPath = "/details";

    const userDetailsResponse = await axiosRequest({
        method: "get",
        url: idamBaseUrl + idamDetailsPath,
        headers: { Authorization: `Bearer ${authToken}` },
    });
    await ApiCounter.incrementUserIdCall();

    if (cached) {
        cached.userId = userDetailsResponse.data.id;
        tokenCache.set(userName, cached);
    } else {
        tokenCache.set(userName,
          {
            token: authToken,
            expiry: 0,
            userId: userDetailsResponse.data.id
          }
        );
    }
    return userDetailsResponse.data.id;
}

export async function getServiceToken(): Promise<string> {
    const cached = tokenCache.get("finrem-service-token");
    const now = Date.now();
    if (cached && cached.expiry > now) {
        return cached.token;
    }

    const serviceSecret = process.env.FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY || "";
    const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
    const s2sAuthPath = "/lease";

    const oneTimePassword = authenticator.generate(serviceSecret);

    const serviceTokenResponse = await axiosRequest({
        url: s2sBaseUrl + s2sAuthPath,
        method: "post",
        data: {
            microservice: "finrem_case_orchestration",
            oneTimePassword,
        },
        headers: {
            "Content-Type": "application/json",
        },
    });
    await ApiCounter.incrementServiceTokenCall();

    tokenCache.set("finrem-service-token",
      {
        token: serviceTokenResponse.data,
        expiry: 1000 * getJwtExpiry(serviceTokenResponse.data) + now - 60000,
        userId: ""
      }
    );
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
