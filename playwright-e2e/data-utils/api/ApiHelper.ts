import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const axiosClient = axios.create({});

export async function axiosRequest<T = any>(
    requestParams: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
    try {
        const response = await axiosClient(requestParams);
        if (![200, 201].includes(response.status)) {
            throw new Error(`Request to ${requestParams.url} failed with status ${response.status}. Response data: ${JSON.stringify(response.data)}`);
        }
        return response;
    } catch (error: any) {
        const serverMessage = error.response?.data
            ? ` \nServer response: ${JSON.stringify(error.response.data)}`
            : "";
        throw new Error(
            `Request to ${requestParams.url} failed: ${error.message}${serverMessage}`
        );
    }
}
