import {getTaskLabel, toLocalDateTime} from "../../../../lib/utils.ts";
import type {CamundaTask} from "../../../../camundaClient/domain.ts";
import * as React from "react";
import {useLocalization} from "../../../../i18n/useLocalization.ts";
import {createDetailsCard} from "../../../../lib/controls.tsx";

type Props = {
    task: CamundaTask
}

export const CamundaTaskInfo: React.FC<Props> = ({task}) => {

    const loc = useLocalization();

    return (<>
        {createDetailsCard(loc.field.processId, task.processInstanceId)}
        {createDetailsCard(loc.field.taskId, task.id)}
        {createDetailsCard(loc.field.taskName, getTaskLabel( loc, task.name))}
        {createDetailsCard(loc.field.claimTimestamp, toLocalDateTime(task.created))}
    </>)
};