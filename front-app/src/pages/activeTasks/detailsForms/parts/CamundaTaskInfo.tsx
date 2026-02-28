import {toLocalDateTime} from "../../../../lib/utils.ts";
import type {CamundaTask} from "../../../../camundaClient/domain.ts";
import * as React from "react";
import {getLocalization} from "../../../../i18n/language.ts";
import {useApplicationState} from "../../../../ApplicationState.ts";

type Props = {
    task: CamundaTask
}

export const CamundaTaskInfo: React.FC<Props> = ({task}) => {

    const language = useApplicationState((s) => s.language);
    const loc = getLocalization(language);

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
    </>)
};