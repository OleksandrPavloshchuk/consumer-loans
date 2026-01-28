import {notifications} from "@mantine/notifications";
import type {AxiosResponse} from "axios";

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

export const URI_CAMUNDA_BASE = "/engine-rest-proxy/";