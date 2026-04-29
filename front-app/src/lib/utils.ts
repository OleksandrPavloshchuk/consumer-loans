import {notifications} from "@mantine/notifications";
import type {AxiosResponse} from "axios";
import {type CamundaTask} from "../camundaClient/domain.ts";
import type {Localization} from "../i18n/en.ts";
import {useApplicationState} from "../ApplicationState.ts";

export const notify = (title: string, text: string) => {
    notifications.show({
        autoClose: 2000,
        title: title,
        message: text,
        color: "navy"
    })
};

export const toCurrency = (n: number | undefined) => {
    const lang = useApplicationState.getState().language;
    return n != null ?
        new Intl.NumberFormat(lang, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(n)
        : '-';
}

export const toLocalDateTime = (s: string | undefined) => {
    const lang = useApplicationState.getState().language;
    return s ?
        new Intl.DateTimeFormat(lang, {
            dateStyle: "long",
            timeStyle: "short"
        }).format(new Date(s))
        : '-';
}


export const toJson = (res: AxiosResponse) => res.data;

export const showError = (e: Error) => {
    if (e.code == "ERR_CANCELED" || e.name !== "AbortError") {
        return;
    }
    notify("Error", `${e}`)
}

export const mockMatchMedia = (vi: any) => Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // legacy
        removeListener: vi.fn(), // legacy
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

export const getActiveTaskTitle = (loc: Localization, task: CamundaTask) => (
    `${task.id}: ${loc.loanStatus[task.name as keyof typeof loc.loanStatus]}`
);

export const getTaskLabel = (loc: Localization, taskName: string) =>
    loc.loanStatus[taskName as keyof typeof loc.loanStatus] ?? taskName;

export const URI_CAMUNDA_BASE = "/engine-rest-proxy/";