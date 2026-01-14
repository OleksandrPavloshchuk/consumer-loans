import {create} from "zustand";

export interface LoginState {
    user: string | undefined;
    setUser: (s: string | undefined) => void;
    password: string | undefined;
    setPassword: (s: string | undefined) => void
}

export const useLoginState = create<LoginState>((set) => ({
    user: undefined,
    setUser: (s: string|undefined)=> set({user: s}),
    password: undefined,
    setPassword: (s: string|undefined)=> set({password: s})
}));