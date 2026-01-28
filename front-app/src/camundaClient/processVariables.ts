import {toJson, URI_CAMUNDA_BASE} from "../lib/utils.ts";
import type {CamundaProcessVars} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";

export const getCamundaProcessVariables = (
    processInstanceId: string,
    setResult: (v: CamundaProcessVars) => void,
    setError: (e: Error) => void) => {
    const controller = new AbortController();

    createJwtConnector().get(`${URI_CAMUNDA_BASE}process-instance/${processInstanceId}/variables`, {
        signal: controller.signal
    })
        .then(toJson)
        .then(setResult)
        .catch((e: Error) => setError(e))

    return () => controller.abort();
};