import {create} from "zustand";

export interface AuthenticationState {
    token: string | undefined;
    setToken: (s: string | undefined) => void;
    isAuthenticated: () => boolean;
}

export const useAuthenticationState = create<AuthenticationState>(
    (set, get) => ({
        token: undefined,
        setToken: (s: string | undefined) => set({token: s}),
        isAuthenticated: () => {
            // TODO
            return !!get().token;
        }
    }));
