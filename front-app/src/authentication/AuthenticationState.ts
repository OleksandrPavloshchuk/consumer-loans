import {create} from "zustand";
import {getToken, setToken} from "./authenticationService.ts";

export interface AuthenticationState {
    token: string | null;
    setToken: (s: string|undefined) => void;
    isAuthenticated: () => boolean;
}

export const useAuthenticationState = create<AuthenticationState>(
    (_, get) => ({
        token: getToken(),
        setToken: (s: string|undefined)=> setToken(s),
        isAuthenticated: () => !!get().token
    }));
