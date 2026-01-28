import {create} from "zustand";
import {toJson, URI_CAMUNDA_BASE} from "../lib/utils.ts";
import type {CamundaTask} from "./domain.ts";
import {createJwtConnector} from "../axiosClient/backendConnector.ts";
import {useLoginState} from "../pages/login/LoginState.ts";
import {ArchiveRecord} from "./domain.ts";
import type {SortMode} from "../lib/SortArrow.tsx";

export interface CamundaArchiveListModel {
    result: ArchiveRecord[],
    retrieve: (setError: (e: Error) => void) => void,
    doRefresh: () => void,
    onRefresh: string | undefined,
    useExtraFilters: boolean,
    setUseExtraFilters: (b:boolean) => void,
    startedFrom: Date | undefined,
    setStartedFrom: (d: Date | undefined) => void
    startedTo: Date | undefined,
    setStartedTo: (d: Date | undefined) => void,
    startDateOrder: SortMode,
    setStartDateOrder: (m: SortMode) => void
}

export const useCamundaArchiveList = create<CamundaArchiveListModel>((set) => ({
    result: [],
    retrieve: (
        setError: (e: Error) => void) => {
        const controller = new AbortController();

        const startDateOrder = useCamundaArchiveList.getState().startDateOrder;

        createJwtConnector().post(
            `${URI_CAMUNDA_BASE}history/process-instance`,
            {
                sortBy: "startTime",
                sortOrder: startDateOrder,
                finished: true
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
    useExtraFilters: false,
    setUseExtraFilters: (b:boolean) => set({useExtraFilters: b}),
    startedFrom: undefined,
    setStartedFrom: (d: Date | undefined) => set({startedFrom: d}),
    startedTo: undefined,
    setStartedTo: (d: Date | undefined) => set({startedTo: d}),
    startDateOrder: "asc",
    setStartDateOrder: (m: SortMode) => set({startDateOrder: m})
}));

const filterResponse = (src: ArchiveRecord[]) => {
    if (!useCamundaArchiveList.getState().useExtraFilters) {
        return src;
    }

    const startedFrom = useCamundaArchiveList.getState().startedFrom;
    const startedTo = useCamundaArchiveList.getState().startedTo;

    return src.filter( (item: ArchiveRecord) => {
        const isGreaterThanStartedFrom = !startedFrom || new Date(item.startTime) > startedFrom
        const isLessThanStartedTo = !startedTo || new Date(item.startTime) < startedTo
        return isGreaterThanStartedFrom
            && isLessThanStartedTo;
    });
}
