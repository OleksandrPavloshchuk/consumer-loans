import {useApplicationState} from "../../ApplicationState.ts";
import {ArchiveMainTable} from "./MainTable.tsx";
import {Flex, Stack, Switch} from "@mantine/core";
import {MainTableFilter} from "./MainTableFilter.tsx";
import {useState} from "react";

export const ArchiveRoot: React.FC = () => {

    const [extraFilters, setExtraFilters] = useState(false);

    const setActivePageName = useApplicationState((s) => s.setActivePageName);
    setActivePageName("archive");

    return (
        <Stack gap="xs">
            <Flex w="100%" gap="sm" align="center"
                  style={{ minHeight: 64 }}
            >
                <Switch
                    label="Фільтри"
                    checked={extraFilters}
                    onChange={(event) => setExtraFilters(event.currentTarget.checked)}
                />
                {extraFilters &&
                    <MainTableFilter/>
                }
            </Flex>
            <ArchiveMainTable/>
        </Stack>
    );
}
