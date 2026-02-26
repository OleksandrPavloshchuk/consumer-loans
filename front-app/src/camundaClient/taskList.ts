import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../lib/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";
import {useLoginState} from "../pages/login/LoginState.ts";
import type {SortMode} from "../lib/SortDropdown.tsx";

export interface CamundaTaskListModel {
    result: CamundaTask[],
    retrieve: (setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined,
    createdOrder: SortMode,
    setCreatedOrder: (m: SortMode) => void
}

export const useCamundaTaskList = create<CamundaTaskListModel>((set) => ({
    result: [],
    retrieve: (
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        const userName = useLoginState.getState().user;

        const createdOrder = useCamundaTaskList.getState().createdOrder;

        createJwtConnector().post(
            `${URI_CAMUNDA_BASE}task?includeProcessVariables=true&candidateUser=${userName}`,
            {
                sortBy: "created",
                sortOrder: createdOrder,
            },
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
    onRefresh: undefined,
    createdOrder: "desc",
    setCreatedOrder: (m: SortMode) => set({createdOrder: m})
}));
