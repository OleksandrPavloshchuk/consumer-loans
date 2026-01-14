import {Anchor, AppShell, Group, Title} from "@mantine/core";
import {Link, Outlet} from "react-router-dom";

export const ApplicationLayout = () => <AppShell
    header={{height: 60}}
    padding="md"
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
            <Title order={4}>Location Selector Demo</Title>
            <Group>
                <Anchor
                    component={Link} to="/select-location"
                >Select Location</Anchor>
                <Anchor
                    component={Link} to="/personal-search-center-groups"
                >Personal Search Center Groups</Anchor>
            </Group>
        </Group>
    </AppShell.Header>
    <AppShell.Main>
        <Outlet/>
    </AppShell.Main>
</AppShell>;