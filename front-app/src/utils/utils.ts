import {notifications} from "@mantine/notifications";

export const notify = (title: string, text: string) => {
    notifications.show({
        autoClose: 2000,
        title: title,
        message: text,
        color: "navy"
    })
};

export const toCurrency = (n: number|undefined) => n ?
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

export const toJson = (res: Response) => {
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
}

export const showError = (e: Error)=> {
    if (e.name !== "AbortError") {
        notify("Error", `${e}`)
    }
}

export const URI_CAMUNDA_BASE = "/engine-rest/";
//export const BASIC_AUTH_KEY = "Basic ZGVtbzpkZW1vcGFzcw==";