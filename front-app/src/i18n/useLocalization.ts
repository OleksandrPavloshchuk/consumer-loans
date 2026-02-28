import {useApplicationState} from "../ApplicationState.ts";
import {getLocalization} from "./language.ts";

export const useLocalization = () => {
    const language = useApplicationState((s) => s.language);
    return getLocalization(language);
}