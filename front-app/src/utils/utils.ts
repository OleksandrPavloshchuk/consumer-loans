import {notifications} from "@mantine/notifications";
import type {AxiosResponse} from "axios";
import {useAuthenticationState} from "../authentication/AuthenticationState.ts";
import {useLoginState} from "../pages/login/LoginState.ts";

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
    if (e.name !== "AbortError") {
        notify("Error", `${e}`)
    }
}

export const getAuthentication = () => ({
    username: useLoginState.getState().user,
    password: useLoginState.getState().password
});

export const URI_CAMUNDA_BASE = "/engine-rest/";