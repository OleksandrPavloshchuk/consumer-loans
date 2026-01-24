import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";
import {useLoginState} from "../pages/login/LoginState.ts";

// TODO use CamundaTask as archive data for a while
export interface CamundaArchiveListModel {
    result: CamundaTask[],
    retrieve: (setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined
}

export const useCamundaArchiveList = create<CamundaArchiveListModel>((set) => ({
    result: [],
    retrieve: (
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        createJwtConnector().get(
            `${URI_CAMUNDA_BASE}history/task?includeProcessVariables=true`,
            {
                signal: controller.signal,
                // auth: getAuthentication()
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
