import {CamundaTaskInfo} from "./parts/CamundaTaskInfo.tsx";
import {CamundaProcessVars, type CamundaTask} from "../../../camundaClient/domain.ts";
import {useEffect, useState} from "react";
import {getCamundaProcessVariables} from "../../../camundaClient/processVariables.ts";
import {showError} from "../../../utils/utils.ts";
import {type CamundaInputVar, updateCamundaTask} from "../../../camundaClient/updateTask.ts";
import {useCamundaTaskList} from "../../../camundaClient/taskList.ts";

type Props = {
    task: CamundaTask,
    closeTab: (taskId: string) => void,
    renderFormInternal: (
        processVars: CamundaProcessVars|undefined,
        onSave: (outputVars: Map<string, CamundaInputVar>) => void
    ) => React.ReactNode
};

export const DetailsFormsBase: React.FC<Props> = ({task, closeTab, renderFormInternal}) => {

    const [processVars, setProcessVars] = useState<CamundaProcessVars|undefined>(undefined);
    const doRefresh = useCamundaTaskList((s) => s.doRefresh);

    useEffect(() => {
        return getCamundaProcessVariables(
            task.processInstanceId,
            setProcessVars,
            showError);
    }, [task.processInstanceId]);

    const onSave = (outputVars: Map<string, CamundaInputVar>) => {
        updateCamundaTask(
            task.id,
            outputVars,
            closeTab,
            doRefresh,
            showError
        );
    };

    return (<>
        <CamundaTaskInfo task={task}/>
        <hr/>
        {renderFormInternal(processVars, onSave)}
    </>);
}