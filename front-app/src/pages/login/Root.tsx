import {Button, Paper, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useLoginState} from "./LoginState.ts";
import {login} from "../../authentication/authenticationService.ts";
import {useNavigate} from "react-router";
import {notify} from "../../utils/utils.ts";
import {useApplicationState} from "../../ApplicationState.ts";

export const LoginRoot: React.FC = () => {

    const setActivePageName = useApplicationState((s) => s.setActivePageName);
    setActivePageName(undefined);

    const user = useLoginState((s) => s.user);
    const setUser = useLoginState((s) => s.setUser);
    const password = useLoginState((s) => s.password);
    const setPassword = useLoginState((s) => s.setPassword);

    const navigate = useNavigate();

    const doLogin = () => {
        if (user && password && user.trim() !== "" && password.trim() !== "") {
            login(user, password)
                .then( () => navigate("/", { replace: true }))
                .catch( () => notify("Вхід заборонено", "Перевірте логін та пароль"));
        }
    }

    return (<>
        <h2>Вхід до системи</h2>
        <Paper p="xs">
            <Stack gap="xs">
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
    </>);
};