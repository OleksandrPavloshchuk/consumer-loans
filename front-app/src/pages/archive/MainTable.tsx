import {ScrollArea, Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../utils/utils.ts";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {useEffect} from "react";
import {formatDuration} from "../../utils/duration.ts";
import {ArchiveRecord} from "../../camundaClient/domain.ts";
import {SortArrow} from "../lib/SortArrow.tsx";

type Props = {
    openRecord: (record: ArchiveRecord) => void
}

export const ArchiveMainTable: React.FC<Props> = ({openRecord}) => {

    const result = useCamundaArchiveList((s) => s.result);
    const retrieve = useCamundaArchiveList((s) => s.retrieve);
    const onRefresh = useCamundaArchiveList((s) => s.onRefresh);
    const order = useCamundaArchiveList((s) => s.startDateOrder);
    const setOrder = useCamundaArchiveList((s) => s.setStartDateOrder);

    useEffect(() => {
        retrieve(showError);
    }, []);
    useEffect(() => {
        retrieve(showError);
    }, [onRefresh, order]);

    return (
        <ScrollArea h={720}>
            <Table>
                <Table.Thead
                    style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'var(--mantine-color-body)',
                        zIndex: 1
                    }}
                >
                    <Table.Tr>
                        <Table.Th>Ідентифікатор позички</Table.Th>
                        <Table.Th>Дата і час подання заявки&nbsp;<SortArrow order={order} setOrder={setOrder}/></Table.Th>
                        <Table.Th>Дата і час закінчення обробки</Table.Th>
                        <Table.Th>Тривалість</Table.Th>
                        <Table.Th>Фінальний стан позички</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        result.map((item) =>
                            <Table.Tr key={item.id}
                                      className={"activeTask"}
                                      onClick={() => openRecord(item)}
                            >
                                <Table.Td>{item.id}</Table.Td>
                                <Table.Td>{toLocalDateTime(item.startTime)}</Table.Td>
                                <Table.Td>{toLocalDateTime(item.endTime)}</Table.Td>
                                <Table.Td>{formatDuration(item.durationInMillis, {locale: 'ua'})}</Table.Td>
                                <Table.Td>{item.state}</Table.Td>
                            </Table.Tr>)
                    }
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );

}