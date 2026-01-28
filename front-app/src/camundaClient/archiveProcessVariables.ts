import {toJson, URI_CAMUNDA_BASE} from "../lib/utils.ts";
import {ArchiveVar} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";

export const getCamundaArchiveProcessVariables = (
    processInstanceId: string,
    setResult: (v: ArchiveVar[]) => void,
    setError: (e: Error) => void) => {
    const controller = new AbortController();

    createJwtConnector().get(`${URI_CAMUNDA_BASE}history/variable-instance?processInstanceId=${processInstanceId}`, {
        signal: controller.signal
    })
        .then(toJson)
        .then(setResult)
        .catch((e: Error) => setError(e))

    return () => controller.abort();
};