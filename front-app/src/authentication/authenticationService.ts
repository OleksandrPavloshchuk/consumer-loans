const KEY = "access_token";

export const getToken = () => localStorage.getItem(KEY);

export const setToken = (s: string|undefined)=> {
    if (s) {
        localStorage.setItem(KEY, s);
    } else {
        localStorage.removeItem(KEY);
    }
}

export const refreshToken = () => {
    // TODO temporary. Create request for real new token
    const newToken = getToken();
    return Promise.resolve(newToken ? newToken : "TODO empty token");
};
