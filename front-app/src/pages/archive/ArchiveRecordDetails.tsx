import type {ArchiveRecord} from "../../camundaClient/domain.ts";
import {ArchiveVar, getFieldLabel} from "../../camundaClient/domain.ts";
import {Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../utils/utils.ts";
import {formatDuration} from "../../utils/duration.ts";
import {useEffect, useState} from "react";
import {getCamundaArchiveProcessVariables} from "../../camundaClient/archiveProcessVariables.ts";

type Props = {
    record: ArchiveRecord
}

export const ArchiveRecordDetails: React.FC<Props> = ({record}) => {

    const [processVars, setProcessVars] = useState<ArchiveVar[]>([]);

    useEffect(() => {
        return getCamundaArchiveProcessVariables(
            record.id,
            setProcessVars,
            showError);
    }, [record.processInstanceId]);

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (typeof value === "object" && value !== null) {
            return JSON.stringify(value, null, 2);
        }

        return String(value);
    };

    return (<Table>
        <Table.Tbody>
            <Table.Tr>
                <Table.Td>Ідентифікатор позички</Table.Td>
                <Table.Td>{record.id}</Table.Td>
            </Table.Tr>

            <Table.Tr>
                <Table.Td>Дата і час подання заявки</Table.Td>
                <Table.Td>{toLocalDateTime(record.startTime)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>Дата і час закінчення обробки</Table.Td>
                <Table.Td>{toLocalDateTime(record.endTime)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>Тривалість</Table.Td>
                <Table.Td>{formatDuration(record.durationInMillis, {locale: 'ua'})}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>Фінальний стан позички</Table.Td>
                <Table.Td>{record.state}</Table.Td>
            </Table.Tr>
            {
                processVars
                    .sort((i1, i2)=> i1.name.localeCompare(i2.name))
                    .map( (v) => (
                    <Table.Tr key={v.name}>
                        <Table.Td>{getFieldLabel(v.name)}</Table.Td>
                        <Table.Td>{renderValue(v.value)}</Table.Td>
                    </Table.Tr>
                ))
            }
    </Table.Tbody>
</Table>)
};
