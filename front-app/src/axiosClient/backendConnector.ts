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
    client.interceptors.response.use(
        r => r,
        async error => {
            const { response, config } = error;
            if (response?.status === 401 && response.data.error === 'access_token_expired') {
                config._retry = true;
                try {
                    await refreshToken();
                    config.headers.Authorization = `Bearer ${getAccessToken()}`;
                    return client(config);
                } catch {
                    window.location.href = "/login";
                }
            }

            if (response?.status === 403) {
                // Access denied - go to login
                window.location.href = "/login";
            }

            return Promise.reject(error);
        }
    );
};