import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../utils/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";
import {useLoginState} from "../pages/login/LoginState.ts";
import {ArchiveRecord} from "./domain.ts";

export interface CamundaArchiveListModel {
    result: ArchiveRecord[],
    retrieve: (setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined,
    startedFrom: Date | undefined,
    setStartedFrom: (d: Date | undefined) => void
}

export const useCamundaArchiveList = create<CamundaArchiveListModel>((set) => ({
    result: [],
    retrieve: (
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        createJwtConnector().post(
            `${URI_CAMUNDA_BASE}history/task`,
            {
                finished: true,
                includeProcessVariables: true
            },
            {
                signal: controller.signal
            }
        )
            .then(toJson)
            .then((records: ArchiveRecord[]) => {
                set({result: filterResponse(records)});
            })
            .catch((e: Error) => setError(e));

        return () => controller.abort();
    },
    doRefresh: () => set({onRefresh: crypto.randomUUID().toString()}),
    onRefresh: undefined,
    startedFrom: undefined,
    setStartedFrom: (d: Date | undefined) => set({startedFrom: d})
}));

const filterResponse = (src: ArchiveRecord[]) => {
    const startedFrom = useCamundaArchiveList.getState().startedFrom;

    return src.filter( (item: ArchiveRecord) => {
        const isGreaterThanStartedFrom = !startedFrom || new Date(item.startTime) > startedFrom
        return isGreaterThanStartedFrom;
    });
}
