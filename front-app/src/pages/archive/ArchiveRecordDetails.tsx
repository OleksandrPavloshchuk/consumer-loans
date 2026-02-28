import type {ArchiveRecord} from "../../camundaClient/domain.ts";
import {ArchiveVar, getFieldIndex} from "../../camundaClient/domain.ts";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {formatDuration} from "../../lib/duration.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {getCamundaArchiveProcessVariables} from "../../camundaClient/archiveProcessVariables.ts";
import {getLocalization, localized} from "../../i18n/language.ts";
import {useApplicationState} from "../../ApplicationState.ts";

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
    const loc = getLocalization(language);

    const renderValue = (v: ArchiveVar) => {
        const value = v.value;
        if (Array.isArray(value)) {
            return (<ul>
                {value.map( (item) => <li>{item}</li>)}
            </ul>);
        }

        if (typeof value === "object" && value !== null) {
            return JSON.stringify(value, null, 2);
        }

        if (v.name == "decision") {
            return localized(loc.decision, value);
        } else if (v.name == "scoringResult") {
            return localized(loc.scoringResult, value);
        } else {
            return String(value);
        }
    };

    const getDecisionCss = (fieldName: string, fieldValue: any) => {
        if (fieldName != 'decision') {
            return ""
        }
        return fieldValue=='APPROVE' ? 'approve' : 'reject';
    }

    return (<div className={"card-details"}>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.loanId}</div>
            <div>{record.id}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.finalState}</div>
            <div>{localized(loc.status, record.state)}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.claimTimestamp}</div>
            <div>{toLocalDateTime(record.startTime)}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.processingEndTimestamp}</div>
            <div>{toLocalDateTime(record.endTime)}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.duration}</div>
            <div>{formatDuration(record.durationInMillis, {locale: 'ua'})}</div>
        </div>
        {
            processVars
                .sort((i1, i2) => getFieldIndex(i1?.name) - getFieldIndex(i2?.name))
                .map((v) => (
                    <div key={v.name} className={`card-details-item ${getDecisionCss(v.name, v.value)}`}>
                        <div className={"label"}>{localized(loc.field, v.name)}</div>
                        <div>{renderValue(v)}</div>
                    </div>
                ))
        }
    </div>);
};
