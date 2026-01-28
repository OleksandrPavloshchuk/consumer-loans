import {createConnector} from "../axiosClient/backendConnector.ts";
import {toJson} from "../lib/utils.ts";
import {jwtDecode} from "jwt-decode";
import {useAuthorizationState} from "./AuthorizationState.ts";

type Key = "access_token" | "refresh_token";
type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};

type RefreshResponse = {
    accessToken: string;
};

export const getAccessToken = () => getToken("access_token");
const getRefreshToken = () => getToken("refresh_token");
const setAccessToken = (val?: string)=> setToken("access_token", val);
const setRefreshToken = (val?: string)=> setToken("refresh_token", val);

export const login = async (user: string, password: string)=> {

    return createConnector().post( "/auth/login", {user, password})
        .then(toJson)
        .then((data: LoginResponse) => {
            retrieveAccessToken(data);
            setRefreshToken(data.refreshToken);
            return data.accessToken;
        });
}

export const refreshToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error("No refresh token");
    }

    return createConnector().post("/auth/refresh", {refreshToken})
        .then(toJson)
        .then((data: RefreshResponse)=> {
            retrieveAccessToken(data);
            return data.accessToken;
        })
        .catch(handleError);
};

const retrieveAccessToken = (data: LoginResponse) => {
    setAccessToken(data.accessToken);
    useAuthorizationState.getState().setGroups(getGroupsFromToken(data.accessToken));
};

type TokenPayload = {
    roles?: string[],
    groups?: string[]
};

const getGroupsFromToken = (token: string|null) => {
    return (token) ? jwtDecode<TokenPayload>(token).groups : [];
};

const getToken = (key : Key)=> localStorage.getItem(key);

const setToken = (key: Key, val: string|undefined)=> {
    if (val) {
        localStorage.setItem(key, val);
    } else {
        localStorage.removeItem(key);
    }
}

const handleError = (err: Error)=> {
    console.log(`Error: ${err}`);
}
