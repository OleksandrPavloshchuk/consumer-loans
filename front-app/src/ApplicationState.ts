import {create} from "zustand";

export interface ApplicationState {
    activePageName: string|undefined;
    setActivePageName: (s:string|undefined) => void
}

export const useApplicationState = create<ApplicationState>((set) => ({
    activePageName: undefined,
    setActivePageName: (s: string|undefined)=> set({activePageName: s})
}));