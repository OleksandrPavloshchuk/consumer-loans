import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import {getAccessToken, refreshToken} from "../authentication/authenticationService.ts";

export const createConnector = () => axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json"
    }
});

export const createJwtConnector = () => {
    const result = createConnector();
    addJwtAuthenticationInterceptor(result);
    addNeedsRefreshInterceptor(result);
    return result;
};


const addJwtAuthenticationInterceptor = (client: AxiosInstance)=> {
    client.interceptors.request.use( (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

const addNeedsRefreshInterceptor = (client: AxiosInstance)=> {
    client.interceptors.response.use( response => response, async (error: {response: AxiosResponse}) => {
        const response = error.response;
        if (response && response.status === 401) {
            // Non authorized - authentication token is stale; request new one use refresh token:
            refreshToken()
                .then(() => {
                    response.config.headers.Authorization = `Bearer ${getAccessToken()}`;
                    return client(response.config);
                })
                .catch( () => {
                    window.location.href = "/login";
                    return Promise.reject();
                });
        }
        return Promise.reject();
    });
};