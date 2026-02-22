import {ScrollArea, Table} from "@mantine/core";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import {useEffect} from "react";
import {formatDuration} from "../../lib/duration.ts";
import {ArchiveRecord} from "../../camundaClient/domain.ts";
import {SortArrow} from "../../lib/SortArrow.tsx";
import * as React from "react";
import {useApplicationState} from "../../ApplicationState.ts";
import {getLocalization, localized} from "../../i18n/language.ts";

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

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

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
                        <Table.Th>{loc.field.loanId}</Table.Th>
                        <Table.Th>{loc.field.claimTimestamp}&nbsp;<SortArrow order={order} setOrder={setOrder}/></Table.Th>
                        <Table.Th>{loc.field.processingEndTimestamp}</Table.Th>
                        <Table.Th>{loc.field.duration}</Table.Th>
                        <Table.Th>{loc.field.finalState}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        result.map((item) =>
                            <Table.Tr key={item.id}
                                      className={"activeItem"}
                                      onClick={() => openRecord(item)}
                            >
                                <Table.Td>{item.id}</Table.Td>
                                <Table.Td>{toLocalDateTime(item.startTime)}</Table.Td>
                                <Table.Td>{toLocalDateTime(item.endTime)}</Table.Td>
                                <Table.Td>{formatDuration(item.durationInMillis, {locale: 'ua'})}</Table.Td>
                                <Table.Td>{localized(loc.status, item.state)}</Table.Td>
                            </Table.Tr>)
                    }
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );

}