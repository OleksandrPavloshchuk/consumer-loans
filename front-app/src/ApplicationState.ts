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

export const getActivePageNameLocalized = (id: PageId) => {
    let r: string|undefined;
    switch (id) {
        case "activeTasks":
            r = "В роботі"; break;
        case "archive":
            r = "Архів"; break;
    }
    return r;
}
