import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {Button, Flex} from "@mantine/core";
import {DateTimePicker} from "@mantine/dates";
import * as React from "react";
import {useLocalization} from "../../i18n/language.ts";

export const MainTableFilter: React.FC = () => {

    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    const startedFrom = useCamundaArchiveList((s) => s.startedFrom);
    const setStartedFrom = useCamundaArchiveList((s) => s.setStartedFrom);
    const startedTo = useCamundaArchiveList((s) => s.startedTo);
    const setStartedTo = useCamundaArchiveList((s) => s.setStartedTo);

    const loc = useLocalization();

    return (
        <Flex gap="sm" align="center">
            <DateTimePicker
                label={loc.page.archive.filters.startedFrom.label}
                placeholder={loc.page.archive.filters.startedFrom.placeholder}
                value={startedFrom}
                onChange={setStartedFrom}
                clearable
                styles={{
                    calendarHeaderControl: {
                        width: 28,
                        height: 28,
                    },
                }}
            />
            <DateTimePicker
                label={loc.page.archive.filters.startedTo.label}
                placeholder={loc.page.archive.filters.startedTo.placeholder}
                value={startedTo}
                onChange={setStartedTo}
                clearable
                styles={{
                    calendarHeaderControl: {
                        width: 28,
                        height: 28,
                    },
                }}
            />
            <Button onClick={doRefresh}>{loc.page.archive.filters.apply}</Button>
        </Flex>
    );
}