import {Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../utils/utils.ts";
import {useCamundaTaskList} from "../../camundaClient/taskList.ts";
import {useEffect} from "react";
import type {CamundaTask} from "../../camundaClient/domain.ts";

export const ArchiveMainTable: React.FC = () => {

    // TODO temporary
    const result = [
        {
            id: "1",
            created: "2026/01/26 10:10",
            personName: "The 1st person",
            amount: 101.23,
            decision: "APPROVED"
        }

    ];

    return (
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
                            <Table.Td>{item.personName}</Table.Td>
                            <Table.Td>{item.amount}</Table.Td>
                            <Table.Td>{item.decision}</Table.Td>
                        </Table.Tr>)
                }
            </Table.Tbody>
        </Table>
    );

}