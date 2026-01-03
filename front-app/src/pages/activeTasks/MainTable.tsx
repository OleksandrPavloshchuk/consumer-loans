import {Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../utils/utils.ts";
import {useCamundaTaskList} from "../../camundaClient/CamundaTaskList.ts";
import {useEffect} from "react";
import type {CamundaTask} from "../../camundaClient/domain.ts";

type Props = {
    openTask: (task: CamundaTask) => void
}

export const ActiveTasksMainTable: React.FC<Props> = ({openTask}) => {

    const result = useCamundaTaskList((s) => s.result);
    const retrieve = useCamundaTaskList((s) => s.retrieve);
    const onRefresh = useCamundaTaskList((s) => s.onRefresh);

    useEffect(() => {
        retrieve(showError);
    }, []);
    useEffect(() => {
        retrieve(showError);
    }, [onRefresh]);

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID задачі</Table.Th>
                    <Table.Th>Назва</Table.Th>
                    <Table.Th>ID працюючого процесу</Table.Th>
                    <Table.Th>Дата і час створення задачі</Table.Th>
                    <Table.Th>Дата і час останньої зміни задачі</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {
                    result.map((item) =>
                        <Table.Tr key={item.id}
                                  onClick={() => openTask(item)}
                                  className={"activeTask"}
                        >
                            <Table.Td>{item.id}</Table.Td>
                            <Table.Td>{item.name}</Table.Td>
                            <Table.Td>{item.processInstanceId}</Table.Td>
                            <Table.Td>{toLocalDateTime(item.created)}</Table.Td>
                            <Table.Td>{toLocalDateTime(item.lastUpdated)}</Table.Td>
                        </Table.Tr>)
                }
            </Table.Tbody>
        </Table>
    );

}