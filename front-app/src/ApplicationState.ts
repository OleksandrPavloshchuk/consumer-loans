import {create} from "zustand";
import type {Language} from "./i18n/language.ts";

export type PageId = "activeTasks"|"archive";

export interface ApplicationState {
    language: Language;
    setLanguage: (l: Language) => void;
    activePageName: PageId | undefined;
    setActivePageName: (s:PageId | undefined) => void
}

export const useApplicationState = create<ApplicationState>((set) => ({
    language: "en",
    setLanguage: (l: Language) => set({language: l}),
    activePageName: "activeTasks",
    setActivePageName: (s: PageId)=> set({activePageName: s})
}));

