import {create} from "zustand";
import {getAccessToken} from "./authenticationService.ts";

export interface AuthenticationState {
    token: string | null;
    isAuthenticated: () => boolean;
}

export const useAuthenticationState = create<AuthenticationState>(
    (_, get) => ({
        token: getAccessToken(),
        isAuthenticated: () => !!get().token
    }));
