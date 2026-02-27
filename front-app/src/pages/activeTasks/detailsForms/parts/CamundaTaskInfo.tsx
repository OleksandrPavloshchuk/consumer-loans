import {toLocalDateTime} from "../../../../lib/utils.ts";
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

    return (<>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.processId}</div>
            <div>{task.processInstanceId}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.taskId}</div>
            <div>{task.id}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.taskName}</div>
            <div>{loc.loanStatus[task.name as keyof typeof loc.loanStatus]}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.claimTimestamp}</div>
            <div>{toLocalDateTime(task.created)}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.lastUpdateTimestamp}</div>
            <div>{toLocalDateTime(task.lastUpdated)}</div>
        </div>
    </>)
};