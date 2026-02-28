import {ArchiveVar} from "../camundaClient/domain.ts";
import {localized} from "../i18n/language.ts";
import type {Localization} from "../i18n/en.ts";

export const getFieldPresentation = (v: ArchiveVar, loc: Localization) => {
    const value = v.value;
    if (Array.isArray(value)) {
        return (<ul>
            {value.map((item) => <li>{item}</li>)}
        </ul>);
    }

    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value, null, 2);
    }

    if (v.name == "decision") {
        return localized(loc.decision, value);
    } else if (v.name == "scoringResult") {
        return localized(loc.scoringResult, value);
    } else {
        return String(value);
    }
}