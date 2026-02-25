import {ScrollArea} from "@mantine/core";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import * as React from "react";
import {useEffect} from "react";
import {formatDuration} from "../../lib/duration.ts";
import {ArchiveRecord} from "../../camundaClient/domain.ts";
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
    // const setOrder = useCamundaArchiveList((s) => s.setStartDateOrder);

    useEffect(() => {
        retrieve(showError);
    }, []);
    useEffect(() => {
        retrieve(showError);
    }, [onRefresh, order]);

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);


    // <SortArrow order={order} setOrder={setOrder}/></Table.Th>

    return (
        <ScrollArea h={720}>
            <div className="card-set">{
                result.map((item) =>
                    <div
                        key={item.id}
                        className="card"
                        onClick={() => openRecord(item)}
                    >
                        <div className="card-item label g-1-1">{loc.field.loanId}</div>
                        <div className="card-item g-1-2">{item.id}</div>
                        <div className="card-item label g-2-1">{loc.field.claimTimestamp}</div>
                        <div className="card-item g-2-2">{toLocalDateTime(item.startTime)}</div>
                        <div className="card-item label g-3-1">{loc.field.processingEndTimestamp}</div>
                        <div className="card-item g-3-2">{toLocalDateTime(item.endTime)}</div>
                        <div className="card-item label g-4-1">{loc.field.duration}</div>
                        <div className="card-item g-4-2">{formatDuration(item.durationInMillis, {locale: 'ua'})}</div>
                        <div className="card-item label g-5-1">{loc.field.finalState}</div>
                        <div className="card-item g-5-2">{localized(loc.status, item.state)}</div>
                    </div>)
            }</div>
        </ScrollArea>
    );

}