import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {Button, Flex} from "@mantine/core";
import {DateTimePicker} from "@mantine/dates";

export const MainTableFilter: React.FC = () => {

    const doRefresh = useCamundaArchiveList((s) => s.doRefresh);
    const startedFrom = useCamundaArchiveList((s) => s.startedFrom);
    const setStartedFrom = useCamundaArchiveList((s) => s.setStartedFrom);

    return (
        <Flex w="100%" gap="sm" align="center">
            <DateTimePicker
                label="Створення позички від"
                placeholder="Початок"
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
            <Button onClick={doRefresh}>Застосувати фільтр</Button>
        </Flex>
    );
}