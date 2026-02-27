import {English} from "./en.ts";
import {Ukrainian} from "./ua.ts";
import {useApplicationState} from "../ApplicationState.ts";

export type Language = "en" | "ua";
export const LANGUAGES: Language[] = [
    "en", "ua"
];

export const localized = (
    section: Record<string, string>|undefined,
    key: string|undefined
) => key && section && section[key ?? ""] ? section[key] : "-";

export const useLocalization = () =>
    getLocalization(useApplicationState.getState().language);

const getLocalization = (l: Language) => {
    switch (l) {
        case "en": return English;
        case "ua": return Ukrainian;
    }
};