import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../lib/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";
import type {SortMode} from "../lib/SortDropdown.tsx";

export interface CamundaTaskListModel {
    result: CamundaTask[],
    retrieve: (userName: string, setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined,
    createdOrder: SortMode,
    setCreatedOrder: (m: SortMode) => void
}

export const useCamundaTaskList = create<CamundaTaskListModel>((set) => ({
    result: [],
    retrieve: (
        userName: string,
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        const createdOrder = useCamundaTaskList.getState().createdOrder;

        createJwtConnector().post(
            `${URI_CAMUNDA_BASE}task?includeProcessVariables=true`,
            {
                // TODO do not pass user here. Back should extract his name from JWT
                candidateUser: userName,
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
    // Set the new variable value in order to trigger useEffect()
    doRefresh: () => set({onRefresh: crypto.randomUUID().toString()}),
    onRefresh: undefined,
    createdOrder: "desc",
    setCreatedOrder: (m: SortMode) => set({createdOrder: m})
}));
