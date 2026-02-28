import {Anchor, AppShell, Group, Title} from "@mantine/core";
import {Link, Outlet} from "react-router-dom";
import {useLoginState} from "./pages/login/LoginState.ts";
import {useApplicationState} from "./ApplicationState.ts";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {LanguagesDropdown} from "./lib/LanguageDropdown.tsx";
import {getLocalization} from "./i18n/language.ts";

export const ApplicationLayout = () => {

    const navigate = useNavigate();

    const user = useLoginState((s) => s.user);
    const language = useApplicationState((s) => s.language);
    const setLanguage = useApplicationState((s) => s.setLanguage);

    const loc = getLocalization(language);
    const activePageName = useApplicationState((s) => s.activePageName);

    const renderActivePage = () => {
        return activePageName
            ? (<Group>
                <Title order={5}>{loc.common.title}</Title>/
                <Title order={5}>{loc.page[activePageName].title}</Title>
            </Group>)
            : null;
    };

    useEffect(() => {
        if (!user || user.length === 0) {
            navigate("/login");
        }
    }, [navigate]);

    const renderLinkInHeader = (label: string | undefined, url: string) => (<Anchor
        style={(theme) => ({
            color: theme.colors.blue[2]
        })}
        component={Link} to={url}>{label}</Anchor>);

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
                    {activePageName !== "activeTasks" &&
                        renderLinkInHeader(loc.page["activeTasks"].title, "/active")
                    }
                    {activePageName !== "archive" &&
                        renderLinkInHeader(loc.page["archive"].title, "/archive")
                    }
                    <LanguagesDropdown value={language} setValue={setLanguage}/>
                    {renderLinkInHeader(loc.common.logout, "/login")}
                </Group>
            </Group>
        </AppShell.Header>
        <AppShell.Main>
            <Outlet/>
        </AppShell.Main>
    </AppShell>;
}