import {create} from "zustand";

const KEY = "access_token";

export interface AuthenticationState {
    token: string | null;
    setToken: (s: string|null) => void;
    isAuthenticated: () => boolean;
}

export const useAuthenticationState = create<AuthenticationState>(
    (_, get) => ({
        token: localStorage.getItem(KEY),
        setToken: (s: string|null)=> {
            if (s) {
                localStorage.setItem(KEY, s);
            }  else {
                localStorage.removeItem(KEY);
            }
        },
        isAuthenticated: () => {
            return !!get().token;
        }
    }));
