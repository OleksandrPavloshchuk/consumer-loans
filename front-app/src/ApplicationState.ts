import {create} from "zustand";

type PageId = "activeTasks"|"archive";

export interface ApplicationState {
    activePageName: PageId;
    setActivePageName: (s:PageId) => void
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
