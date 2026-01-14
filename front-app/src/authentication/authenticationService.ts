import {createConnector} from "../axiosClient/backendConnector.ts";
import {toJson} from "../utils/utils.ts";

type Key = "access_token" | "refresh_token";

export const getAccessToken = () => getToken("access_token");
const getRefreshToken = () => getToken("access_token");
const setAccessToken = (val: string|undefined)=> setToken("access_token", val);
const setRefreshToken = (val: string|undefined)=> setToken("refresh_token", val);

export const login = async (user: string, password: string)=> {
    createConnector().post( "/login", {user, password})
        .then(toJson)
        .then((data: {accessToken: string, refreshToken: string}) => {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
        });
// TODO handle error
//        .catch((error) => {});
}

export const refreshToken = async () => {
    createConnector().post("/refresh", {refreshToken: getRefreshToken()})
        .then(toJson)
        .then((data: {accessToken: string})=> {
            setAccessToken(data.accessToken);
        })
// TODO handle error
//        .catch((error) => {});
};

const getToken = (key : Key)=> localStorage.getItem(key);

const setToken = (key: Key, val: string|undefined)=> {
    if (val) {
        localStorage.setItem(key, val);
    } else {
        localStorage.removeItem(key);
    }
}
