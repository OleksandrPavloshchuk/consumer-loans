import {Table} from "@mantine/core";
import {toLocalDateTime} from "../../../../utils/utils.ts";
import type {CamundaTask} from "../../../../camundaClient/domain.ts";

type Props = {
    task: CamundaTask
}

export const CamundaTaskInfo: React.FC<Props> = ({task}) => (
    <Table>
        <Table.Tbody>
            <Table.Tr>
                <Table.Td>ID процесу</Table.Td>
                <Table.Td>{task.processInstanceId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>ID задачі</Table.Td>
                <Table.Td>{task.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>Операція</Table.Td>
                <Table.Td>{task.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>Дата і час створення</Table.Td>
                <Table.Td>{toLocalDateTime(task.created)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>Дата і час останньої зміни</Table.Td>
                <Table.Td>{toLocalDateTime(task.lastUpdated)}</Table.Td>
            </Table.Tr>
        </Table.Tbody>
    </Table>
);