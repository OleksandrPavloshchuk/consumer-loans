import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import {getToken, refreshToken, setToken} from "../authentication/authenticationService.ts";

export const backendConnector = () => {
    const result = createClient();
    addJwtAuthenticationInterceptor(result);
    addNeedsRefreshInterceptor(result);
    return result;
};

const createClient = () => axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json"
    }
});

const addJwtAuthenticationInterceptor = (client: AxiosInstance)=> {
    client.interceptors.request.use( (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

const addNeedsRefreshInterceptor = (client: AxiosInstance)=> {
    client.interceptors.response.use( response => response, async (response: AxiosResponse) => {
        if (response.status === 401) {
            refreshToken()
                .then( (newToken) => {
                    setToken(newToken);
                    response.config.headers.Authorization = `Bearer ${newToken}`;
                    return axios.create(response.config);
                })
                .catch( () => {
                    window.location.href = "/login";
                    return Promise.reject();
                });
        }
        return Promise.reject();
    });
};