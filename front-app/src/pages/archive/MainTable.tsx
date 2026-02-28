import {ScrollArea} from "@mantine/core";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {useCamundaArchiveList} from "../../camundaClient/archiveList.ts";
import * as React from "react";
import {useEffect} from "react";
import {formatDuration} from "../../lib/duration.ts";
import {ArchiveRecord} from "../../camundaClient/domain.ts";
import {localized} from "../../i18n/language.ts";
import {useLocalization} from "../../i18n/useLocalization.ts";

type Props = {
    openRecord: (record: ArchiveRecord) => void
}

export const ArchiveMainTable: React.FC<Props> = ({openRecord}) => {

    const result = useCamundaArchiveList((s) => s.result);
    const retrieve = useCamundaArchiveList((s) => s.retrieve);
    const onRefresh = useCamundaArchiveList((s) => s.onRefresh);
    const order = useCamundaArchiveList((s) => s.startDateOrder);

    useEffect(() => retrieve(order, showError), []);
    useEffect(() => retrieve(order, showError), [onRefresh, order]);

    const loc = useLocalization();

    return (
        <ScrollArea h={720}>
            <div className="card-set">{
                result.map((item) =>
                    <div
                        key={item.id}
                        className="card"
                        onClick={() => openRecord(item)}
                    >
                        <div className="label">{loc.field.loanId}</div>
                        <div>{item.id}</div>
                        <div className="label">{loc.field.claimTimestamp}</div>
                        <div>{toLocalDateTime(item.startTime)}</div>
                        <div className="label">{loc.field.processingEndTimestamp}</div>
                        <div>{toLocalDateTime(item.endTime)}</div>
                        <div className="label">{loc.field.duration}</div>
                        <div>{formatDuration(item.durationInMillis, {locale: 'ua'})}</div>
                        <div className="label">{loc.field.finalState}</div>
                        <div>{localized(loc.status, item.state)}</div>
                    </div>)
            }</div>
        </ScrollArea>
    );

}