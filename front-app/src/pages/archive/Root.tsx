import {ArchiveMainTable} from "./MainTable.tsx";
import {Flex, Paper, Stack, Switch} from "@mantine/core";
import {MainTableFilter} from "./MainTableFilter.tsx";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import * as React from "react";
import {useEffect} from "react";
import {ArchiveRecord, TabbedPageItem} from "../../camundaClient/domain.ts";
import {ArchiveRecordDetails} from "./ArchiveRecordDetails.tsx";
import {TabbedPage} from "../../lib/TabbedPage.tsx";
import {useLocalization} from "../../i18n/language.ts";
import {SortDropdown} from "../../lib/SortDropdown.tsx";

export const ArchiveRoot: React.FC = () => {

    const useExtraFilters = useCamundaArchiveList((s) => s.useExtraFilters);
    const setUseExtraFilters = useCamundaArchiveList((s) => s.setUseExtraFilters);
    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    const startDateOrder = useCamundaArchiveList((s) => s.startDateOrder);
    const setStartDateOrder = useCamundaArchiveList((s) => s.setStartDateOrder);

    useEffect(() => doRefresh(), [useExtraFilters]);

    const renderDetailsTab = (item: TabbedPageItem) => <ArchiveRecordDetails record={item as ArchiveRecord}/>;

    const loc = useLocalization();

    const renderListTab = (openTab: (item: TabbedPageItem) => void) => (
        <Stack>
            <Paper shadow="sm" p="xs">
                <Flex w="100%" gap="sm" align="center"
                      style={{minHeight: 64}}
                >
                    <span className={"custom-label"}>{`${loc.sort.label}: `}</span>
                    <SortDropdown value={startDateOrder} setValue={setStartDateOrder} />
                    <Switch
                        label={loc.page.archive.filters.label}
                        checked={useExtraFilters}
                        onChange={(event) => setUseExtraFilters(event.currentTarget.checked)}
                    />
                    {useExtraFilters &&
                        <MainTableFilter/>
                    }
                </Flex>
            </Paper>
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
