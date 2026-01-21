import {create} from "zustand";

export interface AuthorizationState {
    roles: string[];
    setRoles: (r: string[]) => void;
}

export const useAuthorizationState = create<AuthorizationState>(
    (set) => ({
        roles: [],
        setRoles: (r: string[]) => set({roles: r})
    }));

