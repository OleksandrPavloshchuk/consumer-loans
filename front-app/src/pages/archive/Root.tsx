import {useApplicationState} from "../../ApplicationState.ts";
import {ArchiveMainTable} from "./MainTable.tsx";
import {Flex, Stack, Switch} from "@mantine/core";
import {MainTableFilter} from "./MainTableFilter.tsx";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {useEffect} from "react";

export const ArchiveRoot: React.FC = () => {

    const useExtraFilters = useCamundaArchiveList((s) => s.useExtraFilters);
    const setUseExtraFilters = useCamundaArchiveList((s) => s.setUseExtraFilters);

    const setActivePageName = useApplicationState((s) => s.setActivePageName);
    setActivePageName("archive");

    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    useEffect(() => {
        doRefresh();
    }, [useExtraFilters]);

    return (
        <Stack gap="xs">
            <Flex w="100%" gap="sm" align="center"
                  style={{ minHeight: 64 }}
            >
                <Switch
                    label="Фільтри"
                    checked={useExtraFilters}
                    onChange={(event) => setUseExtraFilters(event.currentTarget.checked)}
                />
                {useExtraFilters &&
                    <MainTableFilter/>
                }
            </Flex>
            <ArchiveMainTable/>
        </Stack>
    );
}
