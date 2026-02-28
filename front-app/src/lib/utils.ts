import {notifications} from "@mantine/notifications";
import type {AxiosResponse} from "axios";
import {type CamundaTask} from "../camundaClient/domain.ts";
import type {Localization} from "../i18n/en.ts";

export const notify = (title: string, text: string) => {
    notifications.show({
        autoClose: 2000,
        title: title,
        message: text,
        color: "navy"
    })
};

export const toCurrency = (n: number | undefined) => n ?
    new Intl.NumberFormat(navigator.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(n)
    : '-';

export const toLocalDateTime = (s: string | undefined) => s ?
    new Intl.DateTimeFormat(navigator.language, {
        dateStyle: "long",
        timeStyle: "short"
    }).format(Date.parse(s))
    : '-';

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