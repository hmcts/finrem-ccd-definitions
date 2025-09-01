import {authenticator} from "otplib";
import {axiosRequest} from "./ApiHelper.ts";

const env = process.env.RUNNING_ENV && process.env.RUNNING_ENV.startsWith("pr-") ? "aat" : (process.env.RUNNING_ENV || "aat");
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;

export async function getUserToken(username: string, password: string): Promise<string> {
    const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
    const redirectUri = `https://div-pfe-${env}.service.core-compute-${env}.internal/authenticated`;
    const idamCodePath = `/oauth2/authorize?response_type=code&client_id=divorce&redirect_uri=${redirectUri}`;

    const idamCodeResponse = await axiosRequest({
        method: "post",
        url: idamBaseUrl + idamCodePath,
        headers: {
            Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const idamAuthPath = `/oauth2/token?grant_type=authorization_code&client_id=divorce&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&code=${idamCodeResponse.data.code}`;

    const authTokenResponse = await axiosRequest({
        method: "post",
        url: idamBaseUrl + idamAuthPath,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return authTokenResponse.data.access_token;
}

export async function getUserId(authToken: string): Promise<string> {
    const idamDetailsPath = "/details";

    const userDetailsResponse = await axiosRequest({
        method: "get",
        url: idamBaseUrl + idamDetailsPath,
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return userDetailsResponse.data.id;
}

export async function getServiceToken(): Promise<string> {
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

    return serviceTokenResponse.data;
}
