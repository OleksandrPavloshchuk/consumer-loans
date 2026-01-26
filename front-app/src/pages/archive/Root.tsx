import {ArchiveMainTable} from "./MainTable.tsx";
import {Flex, Stack, Switch} from "@mantine/core";
import {MainTableFilter} from "./MainTableFilter.tsx";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {useEffect} from "react";
import {ArchiveRecord, TabbedPageItem} from "../../camundaClient/domain.ts";
import {ArchiveRecordDetails} from "./ArchiveRecordDetails.tsx";
import {TabbedPage} from "../lib/TabbedPage.tsx";

export const ArchiveRoot: React.FC = () => {

    const useExtraFilters = useCamundaArchiveList((s) => s.useExtraFilters);
    const setUseExtraFilters = useCamundaArchiveList((s) => s.setUseExtraFilters);
    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    useEffect(() => {
        doRefresh();
    }, [useExtraFilters]);

    const renderDetailsTab = (item: TabbedPageItem) => {
        return <ArchiveRecordDetails record={item as ArchiveRecord}/>
    };

    const renderListTab = (openTab: (item: TabbedPageItem) => void) => (
        <Stack gap="xs">
            <Flex w="100%" gap="sm" align="center"
                  style={{minHeight: 64}}
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
            <ArchiveMainTable openRecord={openTab}/>
        </Stack>
    );

    return (
        <TabbedPage
            pageId="archive"
            getDetailsTabTitle={(item: TabbedPageItem) => item.id}
            renderListTab={renderListTab}
            renderDetailsTab={renderDetailsTab}
        />);
}
