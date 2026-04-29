import type {ArchiveRecord} from "../../camundaClient/domain.ts";
import {ArchiveVar, getFieldIndex} from "../../camundaClient/domain.ts";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {formatDuration} from "../../lib/duration.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {getCamundaArchiveProcessVariables} from "../../camundaClient/archiveProcessVariables.ts";
import {localized} from "../../i18n/language.ts";
import {useLocalization} from "../../i18n/useLocalization.ts";
import {getFieldPresentation} from "../../lib/getFieldPresentation.tsx";
import {ScrollArea} from "@mantine/core";
import {createDetailsCard} from "../../lib/controls.tsx";

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

    const loc = useLocalization();

    const getDecisionCss = (v: ArchiveVar) => {
        if (v.name != 'decision') {
            return ""
        }
        return v.value == 'APPROVE' ? 'approve' : 'reject';
    }

    return (<ScrollArea h={720}>
        <div className={"card-details"}>
            {createDetailsCard(loc.field.loanId, record.id)}
            {createDetailsCard(loc.field.finalState, localized(loc.status, record.state))}
            {createDetailsCard(loc.field.claimTimestamp, toLocalDateTime(record.startTime))}
            {createDetailsCard(loc.field.processingEndTimestamp, toLocalDateTime(record.endTime))}
            {createDetailsCard(loc.field.duration,formatDuration(record.durationInMillis, {locale: 'ua'}))}
            {
                processVars
                    .sort((i1, i2) => getFieldIndex(i1?.name) - getFieldIndex(i2?.name))
                    .map((v) => (
                        <div key={v.name} className={`card-details-item ${getDecisionCss(v)}`}>
                            <div className={"label"}>{localized(loc.field, v.name)}</div>
                            <div>{getFieldPresentation(v, loc)}</div>
                        </div>
                    ))
            }
        </div>
    </ScrollArea>);
};
