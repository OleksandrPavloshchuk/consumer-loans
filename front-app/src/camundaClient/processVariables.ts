import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import type {CamundaProcessVars} from "./domain.ts";

export const getCamundaProcessVariables = (
    processInstanceId: string,
    setResult: (v: CamundaProcessVars) => void,
    setError: (e: Error) => void) => {
    const controller = new AbortController();

    fetch(`${URI_CAMUNDA_BASE}process-instance/${processInstanceId}/variables`, {
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(toJson)
        .then(setResult)
        .catch((e: Error) => setError(e))

    return () => controller.abort();
};