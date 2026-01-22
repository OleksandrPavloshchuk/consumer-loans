import {URI_CAMUNDA_BASE} from "../utils/utils.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";

export type CamundaVarType =
    | "String"
    | "Long"
    | "Double"
    | "Boolean";

export interface CamundaInputVar<T = unknown> {
    value: T;
    type: CamundaVarType;
    local: boolean;
}

export const updateCamundaTask = (
    taskId: string,
    updatedVariables: Map<string, CamundaInputVar> | undefined,
    closeTab: (s: string) => void,
    doRefresh: () => void,
    setError: (e: Error) => void) => {

    const controller = new AbortController();
    completeTask(taskId, updatedVariables, controller)
        .then(doRefresh)
        .then(() => closeTab(taskId))
        .catch((e: Error) => setError(e));
    return () => controller.abort();
};

const completeTask = async (
    taskId: string,
    updatedVariables: Map<string, CamundaInputVar> | undefined,
    controller: AbortController) => {

    const vars = updatedVariables ? {variables: toObject(updatedVariables)} : {};
    return createJwtConnector()
        .post(`${URI_CAMUNDA_BASE}task/${taskId}/complete`, vars,
            {
                signal: controller.signal,
                // auth: getAuthentication()
            })
        .then((res) => res.status >= 200 && res.status < 300)
};

const toObject = (src: Map<string, CamundaInputVar>) =>
    Object.fromEntries(
        Array.from(src.entries()).map(
            ([key, v]) => [key, {value: v.value, type: v.type}]
        )
    );

