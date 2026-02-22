import {Table} from "@mantine/core";
import {getActiveTaskTitle, toLocalDateTime} from "../../../../lib/utils.ts";
import type {CamundaTask} from "../../../../camundaClient/domain.ts";
import * as React from "react";
import {useApplicationState} from "../../../../ApplicationState.ts";
import {getLocalization} from "../../../../i18n/language.ts";

type Props = {
    task: CamundaTask
}

export const CamundaTaskInfo: React.FC<Props> = ({task}) => {

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    return (
        <Table>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>{loc.field.processId}</Table.Td>
                    <Table.Td>{task.processInstanceId}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>{loc.field.taskId}</Table.Td>
                    <Table.Td>{task.id}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>{loc.field.taskName}</Table.Td>
                    <Table.Td>{getActiveTaskTitle(loc, task.name)}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>{loc.field.claimTimestamp}</Table.Td>
                    <Table.Td>{toLocalDateTime(task.created)}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>{loc.field.lastUpdateTimestamp}</Table.Td>
                    <Table.Td>{toLocalDateTime(task.lastUpdated)}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    )
};