import {Anchor, AppShell, Group, Title} from "@mantine/core";
import {Link, Outlet} from "react-router-dom";
import {useLoginState} from "./pages/login/LoginState.ts";
import {useApplicationState} from "./ApplicationState.ts";
import {useNavigate} from "react-router";
import {useEffect} from "react";

export const applicationTitle = "Споживчі позички";

export const ApplicationLayout = () => {

    const navigate = useNavigate();

    const user = useLoginState((s) => s.user);

    const activePageName = useApplicationState((s) => s.activePageName);

    const renderActivePage = () => {
        return activePageName
            ? (<Group><Title order={4}>{applicationTitle}</Title>/<Title order={5}>{activePageName}</Title></Group>)
            : null;
    };

    useEffect(()=>{
        if (!user || user.length===0) {
            navigate("/login");
        }
    }, [navigate]);

    return <AppShell
        header={{height: 60}}
        styles={(theme) => ({
            main: {backgroundColor: theme.white},
            header: {
                backgroundColor: theme.colors.gray[6],
                textShadow: "2px 2px #666666",
                color: theme.colors.gray[3]
            }
        })}
    >
        <AppShell.Header>
            <Group h="100%" justify="space-between" px="md" align="center">
                {renderActivePage()}
                <div>{user}</div>
                <Group>
                    <Anchor
                        style={(theme) => ({
                            color: theme.colors.blue[2]
                        })}
                        component={Link} to="/active"
                    >В роботі</Anchor>
                    <Anchor
                        style={(theme) => ({
                            color: theme.colors.blue[2]
                        })}
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