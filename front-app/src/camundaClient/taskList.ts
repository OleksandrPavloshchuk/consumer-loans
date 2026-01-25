import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";
import {useLoginState} from "../pages/login/LoginState.ts";

export interface CamundaTaskListModel {
    result: CamundaTask[],
    retrieve: (setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined
}

export const useCamundaTaskList = create<CamundaTaskListModel>((set) => ({
    result: [],
    retrieve: (
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        const userName = useLoginState.getState().user;

        createJwtConnector().get(
            `${URI_CAMUNDA_BASE}task?includeProcessVariables=true&candidateUser=${userName}`,
            {
                signal: controller.signal
            })
            .then(toJson)
            .then((tasks: CamundaTask[]) => {
                set({result: tasks});
            })
            .catch((e: Error) => setError(e));

        return () => controller.abort();
    },
    doRefresh: () => set({onRefresh: crypto.randomUUID().toString()}),
    onRefresh: undefined
}));
