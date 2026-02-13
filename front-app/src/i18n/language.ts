import {English} from "./en.ts";
import {Ukrainian} from "./ua.ts";

export type Language = "en" | "ua";
export const LANGUAGES: Language[] = [
    "en", "ua"
];

export const getLocalization = (l: Language) => {
    switch (l) {
        case "en": return English;
        case "ua": return Ukrainian;
    }
};

