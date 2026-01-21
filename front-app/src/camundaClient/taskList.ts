import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";

export interface CamundaTaskListModel {
    result: CamundaTask[],
    retrieve: (login: string, password: string, setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined
}

export const useCamundaTaskList = create<CamundaTaskListModel>((set) => ({
    result: [],
    retrieve: (
        login: string,
        password: string,
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        createJwtConnector().get(
            `${URI_CAMUNDA_BASE}task?includeProcessVariables=true&candidateUser=${login}`,
            {
                signal: controller.signal,
                auth: {username: login, password: password}
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
