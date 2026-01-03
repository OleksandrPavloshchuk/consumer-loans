import {create} from "zustand";
import {BASIC_AUTH_KEY, toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import type {CamundaTask} from "./domain.ts";

export interface CamundaTaskListModel {
    result: CamundaTask[],
    retrieve: (setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined
}

export const useCamundaTaskList = create<CamundaTaskListModel>((set) => ({
    result: [],
    retrieve: (setError: (e: Error) => void) => {
        const controller = new AbortController();

        fetch(`${URI_CAMUNDA_BASE}task?includeProcessVariables=true`, {
            signal: controller.signal,
            headers: {
                "Authorization": BASIC_AUTH_KEY
            }
        })
            .then(toJson)
            .then((tasks: CamundaTask[]) => {
                set({result: tasks});
            })
            .catch((e: Error) => setError(e))

        return () => controller.abort();
    },
    doRefresh: () => set({onRefresh: crypto.randomUUID().toString()}),
    onRefresh: undefined
}));
