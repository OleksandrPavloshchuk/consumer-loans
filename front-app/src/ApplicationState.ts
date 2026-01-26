import {create} from "zustand";

export type PageId = "activeTasks"|"archive";

export interface ApplicationState {
    activePageName: PageId | undefined;
    setActivePageName: (s:PageId | undefined) => void
}

export const useApplicationState = create<ApplicationState>((set) => ({
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
