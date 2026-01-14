import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";

export const createNewCamundaTask = (
    doRefresh: () => void,
    setError: (e: Error) => void) => {
    const controller = new AbortController();

    const request = {
        variables: {
            businessKey: {
                value: crypto.randomUUID().toString(),
                type: "String",
                local: false
            }
        }
    };

    createJwtConnector().post(`${URI_CAMUNDA_BASE}process-definition/key/consumer-loan/start`, {
        signal: controller.signal,
        method: "POST",
        body: JSON.stringify(request)
    })
        .then((res) => {
            doRefresh();
            return res;
        })
        .then(toJson)
        .catch((e: Error) => setError(e))

    return () => controller.abort();
};