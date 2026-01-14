import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";

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

    fetch(`${URI_CAMUNDA_BASE}process-definition/key/consumer-loan/start`, {
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json"
        },
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