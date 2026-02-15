import type {ArchiveRecord} from "../../camundaClient/domain.ts";
import {ArchiveVar, getFieldIndex} from "../../camundaClient/domain.ts";
import {Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {formatDuration} from "../../lib/duration.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {getCamundaArchiveProcessVariables} from "../../camundaClient/archiveProcessVariables.ts";
import {useApplicationState} from "../../ApplicationState.ts";
import {getLocalization} from "../../i18n/language.ts";

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

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    const renderValue = (v: ArchiveVar) => {
        const value = v.value;
        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (typeof value === "object" && value !== null) {
            return JSON.stringify(value, null, 2);
        }

        if (v.name == "decision") {
            return loc.decision[value];
        } else if (v.name == "scoringResult") {
            return loc.scoringResult[value];
        } else {
            return String(value);
        }
    };

    return (<Table>
        <Table.Tbody>
            <Table.Tr>
                <Table.Td>{loc.field.loanId}</Table.Td>
                <Table.Td>{record.id}</Table.Td>
            </Table.Tr>

            <Table.Tr>
                <Table.Td>{loc.field.claimTimestamp}</Table.Td>
                <Table.Td>{toLocalDateTime(record.startTime)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>{loc.field.processingEndTimestamp}</Table.Td>
                <Table.Td>{toLocalDateTime(record.endTime)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>{loc.field.duration}</Table.Td>
                <Table.Td>{formatDuration(record.durationInMillis, {locale: 'ua'})}</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td>{loc.field.finalState}</Table.Td>
                <Table.Td>{record.state}</Table.Td>
            </Table.Tr>
            {
                processVars
                    .sort((i1, i2) => getFieldIndex(i1.name) - getFieldIndex(i2.name))
                    .map((v) => (
                        <Table.Tr key={v.name}>
                            <Table.Td>{loc.field[v.name]}</Table.Td>
                            <Table.Td>{renderValue(v)}</Table.Td>
                        </Table.Tr>
                    ))
            }
        </Table.Tbody>
    </Table>)
};
