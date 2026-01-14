import {Button, Paper, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useLoginState} from "./LoginState.ts";

export const LoginRoot: React.FC = () => {

    const user = useLoginState((s)=> s.user);
    const setUser = useLoginState((s)=> s.setUser);
    const password = useLoginState((s)=> s.password);
    const setPassword = useLoginState((s)=>s.setPassword);
    
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
                <Button>Зайти</Button>
            </Stack>
        </Paper>
    </>);
};