import {English} from "./en.ts";
import {Ukrainian} from "./uk.ts";

export type Language = "en" | "uk";
export const LANGUAGES: Language[] = [
    "en", "uk"
];

export const localized = (
    section: Record<string, string>|undefined,
    key: string|undefined
) => key && section && section[key ?? ""] ? section[key] : "-";

export const getLocalization = (l: Language) => {
    switch (l) {
        case "en": return English;
        case "uk": return Ukrainian;
    }
};