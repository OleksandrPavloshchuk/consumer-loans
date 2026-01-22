import {create} from "zustand";

export interface AuthorizationState {
    groups: string[];
    setGroups: (r: string[]) => void;
}

export const useAuthorizationState = create<AuthorizationState>(
    (set) => ({
        groups: [],
        setGroups: (r: string[]) => set({groups: r})
    }));

