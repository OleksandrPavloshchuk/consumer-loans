import {create} from "zustand";

export interface LoginState {
    user: string;
    setUser: (s: string) => void;
    password: string;
    setPassword: (s: string) => void
}

export const useLoginState = create<LoginState>((set) => ({
    user: "",
    setUser: (s: string)=> set({user: s}),
    password: "",
    setPassword: (s: string)=> set({password: s})
}));