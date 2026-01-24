import {Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../utils/utils.ts";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {useEffect} from "react";

export const ArchiveMainTable: React.FC = () => {

    const result = useCamundaArchiveList((s) => s.result);
    const retrieve = useCamundaArchiveList((s) => s.retrieve);
    const onRefresh = useCamundaArchiveList((s) => s.onRefresh);

    useEffect(() => {
        retrieve(showError);
    }, []);
    useEffect(() => {
        retrieve(showError);
    }, [onRefresh]);

    return (
        <ScrollArea h={600}>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Ідентифікатор почички</Table.Th>
                        <Table.Th>Дата і час подання заявки</Table.Th>
                        <Table.Th>Позичальник</Table.Th>
                        <Table.Th>Сума</Table.Th>
                        <Table.Th>Рішення по позичці</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        result.map((item) =>
                            <Table.Tr key={item.id}>
                                <Table.Td>{item.id}</Table.Td>
                                <Table.Td>{toLocalDateTime(item.created)}</Table.Td>
                                <Table.Td>{"TODO item.personName"}</Table.Td>
                                <Table.Td>{"TODO item.amount"}</Table.Td>
                                <Table.Td>{"TODO item.decision"}</Table.Td>
                            </Table.Tr>)
                    }
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );

}