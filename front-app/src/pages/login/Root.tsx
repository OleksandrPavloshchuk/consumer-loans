import {Button, Paper, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useState} from "react";

export const LoginRoot: React.FC = () => {
    // TODO use zustand state
    const [login, setLogin] = useState<string|undefined>(undefined);
    const [password, setPassword] = useState<string|undefined>(undefined);


    // TODO implement this
    return (<>
        <h2>Вхід до системи</h2>
        <Paper p="xs">
            <Stack gap="xs">
                <div>Користувач:</div>
                <TextInput
                    value={login}
                    onChange={(e) => setLogin(e.currentTarget.value)}
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