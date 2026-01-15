import {Anchor, AppShell, Group, Title} from "@mantine/core";
import {Link, Outlet} from "react-router-dom";
import {useLoginState} from "./pages/login/LoginState.ts";
import {useApplicationState} from "./ApplicationState.ts";

export const ApplicationLayout = () => {

    const user = useLoginState((s) => s.user);

    const activePageName = useApplicationState((s) => s.activePageName);

    const renderActivePage = () => {
        return activePageName
            ? (<Group><Title order={4}>Споживчі позички</Title>/<Title order={5}>{activePageName}</Title></Group>)
            : null;
    };

    return <AppShell
        header={{height: 60}}
        styles={(theme) => ({
            main: {backgroundColor: theme.white},
            header: {
                backgroundColor: theme.colors.gray[1],
                color: theme.colors.gray[6]
            }
        })}
    >
        <AppShell.Header>
            <Group h="100%" justify="space-between" px="md" align="center">
                {renderActivePage()}
                <div>{user}</div>
                <Group>
                    <Anchor
                        component={Link} to="/active"
                    >В роботі</Anchor>
                    <Anchor
                        component={Link} to="/login"
                    >Вихід</Anchor>
                </Group>
            </Group>
        </AppShell.Header>
        <AppShell.Main>
            <Outlet/>
        </AppShell.Main>
    </AppShell>;
}