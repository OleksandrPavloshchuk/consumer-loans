import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {Button, Flex} from "@mantine/core";
import {DateTimePicker, type DateValue} from "@mantine/dates";
import * as React from "react";
import {useLocalization} from "../../i18n/useLocalization.ts";

export const MainTableFilter: React.FC = () => {

    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    const startedFrom = useCamundaArchiveList((s) => s.startedFrom);
    const setStartedFrom = useCamundaArchiveList((s) => s.setStartedFrom);
    const startedTo = useCamundaArchiveList((s) => s.startedTo);
    const setStartedTo = useCamundaArchiveList((s) => s.setStartedTo);

    const loc = useLocalization();

    const createDateTimePicker = (
        l: { label: string, placeholder: string },
        value: DateValue | undefined,
        setValue: (v: DateValue | undefined) => void
    ) => (<DateTimePicker
        label={l.label}
        placeholder={l.placeholder}
        value={value}
        onChange={setValue}
        clearable
        styles={{
            calendarHeaderControl: {
                width: 28,
                height: 28,
            },
        }}
    />);

    return (
        <Flex gap="sm" align="center">
            {createDateTimePicker(loc.page.archive.filters.startedFrom, startedFrom, setStartedFrom)}
            {createDateTimePicker(loc.page.archive.filters.startedTo, startedTo, setStartedTo)}
            <Button onClick={doRefresh}>{loc.page.archive.filters.apply}</Button>
        </Flex>
    );
}