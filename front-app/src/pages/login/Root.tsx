import {Button, Container, Group, Paper, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {useLoginState} from "./LoginState.ts";
import {login} from "../../authentication/authenticationService.ts";
import {useNavigate} from "react-router";
import {notify} from "../../utils/utils.ts";
import {useApplicationState} from "../../ApplicationState.ts";
import {applicationTitle} from "../../ApplicationLayout.tsx";
import {useEffect} from "react";

export const LoginRoot: React.FC = () => {

    const setActivePageName = useApplicationState(
        (s) => s.setActivePageName
    );
    useEffect(() => {
        setActivePageName(undefined);
    }, [setActivePageName]);

    const user = useLoginState((s) => s.user);
    const setUser = useLoginState((s) => s.setUser);
    const password = useLoginState((s) => s.password);
    const setPassword = useLoginState((s) => s.setPassword);

    const navigate = useNavigate();

    const doLogin = () => {
        if (user && password && user.trim() !== "" && password.trim() !== "") {
            login(user, password)
                .then(() => navigate("/", {replace: true}))
                .catch(() => notify("Вхід заборонено", "Перевірте логін та пароль"));
        }
    }

    return (<Container size={"xs"}>
        <Group style={(theme) => ({
            backgroundColor: theme.colors.gray[6],
            textShadow: "2px 2px #666666",
            color: theme.colors.gray[3],
            padding: "1em"
        })}><Title order={4}>{applicationTitle}</Title></Group>
        <Paper p="xs">
            <Stack gap="xs">
                <h3 style={{
                    textAlign: "center"
                }}>Вхід до системи</h3>
                <div>Користувач:</div>
                <TextInput
                    value={user}
                    onChange={(e) => setUser(e.currentTarget.value)}
                />
                <div>Пароль:</div>
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button onClick={doLogin}>Зайти</Button>
            </Stack>
        </Paper>
    </Container>);
};