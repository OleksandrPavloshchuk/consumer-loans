import {Button, Container, Group, Paper, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {useLoginState} from "./LoginState.ts";
import {login} from "../../authentication/authenticationService.ts";
import {useNavigate} from "react-router";
import {notify} from "../../lib/utils.ts";
import {useApplicationState} from "../../ApplicationState.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {LanguagesDropdown} from "../../lib/LanguageDropdown.tsx";
import {getLocalization} from "../../i18n/language.ts";

export const LoginRoot: React.FC = () => {

    const setActivePageName = useApplicationState((s) => s.setActivePageName);
    const language = useApplicationState((s) => s.language);
    const setLanguage = useApplicationState((s) => s.setLanguage);

    const user = useLoginState((s) => s.user);
    const setUser = useLoginState((s) => s.setUser);
    const password = useLoginState((s) => s.password);
    const setPassword = useLoginState((s) => s.setPassword);

    let loc = getLocalization(language);
    useEffect(() => {
        setPassword("");
        setUser("");
    }, []);
    useEffect(() => {
        setActivePageName(undefined);
    }, [setActivePageName]);

    const navigate = useNavigate();

    const doLogin = () => {
        if (user && password && user.trim() !== "" && password.trim() !== "") {
            login(user, password)
                .then(() => navigate("/", {replace: true}))
                .catch(() => notify(
                    loc.login.notify.accessDenied.title,
                    loc.login.notify.accessDenied.message
                ));
        }
    }

    return (<Container size={"xs"}>

        <Group
            justify="space-between"
            px="md"
            align="center"
            style={(theme) => ({
                backgroundColor: theme.colors.gray[6],
                textShadow: "2px 2px #666666",
                color: theme.colors.gray[3],
                padding: "1em"
            })}><Title order={4}>{loc.header.title}</Title>
            <LanguagesDropdown value={language} setValue={setLanguage}/>
        </Group>
        <Paper p="xs">
            <Stack gap="xs">
                <h3 style={{
                    textAlign: "center"
                }}>{loc.login.title}</h3>
                <div>{loc.login.user}</div>
                <TextInput
                    value={user}
                    onChange={(e) => setUser(e.currentTarget.value)}
                />
                <div>{loc.login.password}</div>
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button onClick={doLogin}>{loc.login.submit}</Button>
            </Stack>
        </Paper>
    </Container>);
};