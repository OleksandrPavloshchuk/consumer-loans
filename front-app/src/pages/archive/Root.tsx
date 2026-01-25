import {useApplicationState} from "../../ApplicationState.ts";
import {ArchiveMainTable} from "./MainTable.tsx";
import {ActionIcon, CloseIcon, Flex, Stack, Switch, Tabs} from "@mantine/core";
import {MainTableFilter} from "./MainTableFilter.tsx";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {useEffect, useState} from "react";
import {ArchiveRecord} from "../../camundaClient/domain.ts";
import {ArchiveRecordDetails} from "./ArchiveRecordDetails.tsx";

export const ArchiveRoot: React.FC = () => {

    const [activeTab, setActiveTab] = useState<string | null>("list");
    const [openRecords, setOpenRecords] = useState<ArchiveRecord[]>([]);

    const useExtraFilters = useCamundaArchiveList((s) => s.useExtraFilters);
    const setUseExtraFilters = useCamundaArchiveList((s) => s.setUseExtraFilters);

    const setActivePageName = useApplicationState(
        (s) => s.setActivePageName
    );
    useEffect(() => {
        setActivePageName("archive");
    }, [setActivePageName]);

    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    useEffect(() => {
        doRefresh();
    }, [useExtraFilters]);

    const openRecordTab = (record: ArchiveRecord) => {
        if (!openRecords.find((item) => record.id == item.id)) {
            setOpenRecords([...openRecords, record]);
        }
        setActiveTab(record.id ? record.id : null);
    };

    const closeRecordTab = (recordId: string) => {
        setOpenRecords(prev => prev.filter(item => item.id !== recordId));

        setActiveTab(current =>
            current === recordId ? "list" : current
        );
    }

    return (
        <Tabs defaultValue={"list"} value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab key="list" value={"list"}>Список</Tabs.Tab>
                {
                    openRecords.map((record) =>
                        (<Tabs.Tab key={record.id} value={record.id}>
                            {`${record.id}`}&nbsp;
                            <ActionIcon
                                component="span"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    closeRecordTab(record.id);
                                }}
                                variant="light"
                                size="xs">
                                <CloseIcon/>
                            </ActionIcon>
                        </Tabs.Tab>))
                }
            </Tabs.List>
            <Tabs.Panel value={"list"} mt={"md"}>
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
                    <ArchiveMainTable openRecord={openRecordTab}/>
                </Stack>
            </Tabs.Panel>
            {
                openRecords.map((record) =>
                    (<Tabs.Panel key={record.id} value={record.id}>
                        <ArchiveRecordDetails/>
                    </Tabs.Panel>))
            }

        </Tabs>);
}
