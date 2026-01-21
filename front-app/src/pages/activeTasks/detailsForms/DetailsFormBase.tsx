import {CamundaTaskInfo} from "./parts/CamundaTaskInfo.tsx";
import {CamundaProcessVars, type CamundaTask} from "../../../camundaClient/domain.ts";
import {useEffect, useState} from "react";
import {getCamundaProcessVariables} from "../../../camundaClient/processVariables.ts";
import {showError} from "../../../utils/utils.ts";
import {type CamundaInputVar, updateCamundaTask} from "../../../camundaClient/updateTask.ts";
import {useCamundaTaskList} from "../../../camundaClient/taskList.ts";
import {useLoginState} from "../../login/LoginState.ts";

type Props = {
    task: CamundaTask,
    closeTab: (taskId: string) => void,
    renderFormInternal: (
        processVars: CamundaProcessVars|undefined,
        onSave: (outputVars: Map<string, CamundaInputVar>|undefined) => void
    ) => React.ReactNode
};

export const DetailsFormsBase: React.FC<Props> = ({task, closeTab, renderFormInternal}) => {

    const [processVars, setProcessVars] = useState<CamundaProcessVars|undefined>(undefined);
    const doRefresh = useCamundaTaskList((s) => s.doRefresh);

    const login = useLoginState((s) => s.user);
    const password = useLoginState((s) => s.password);

    useEffect(() => {
        return getCamundaProcessVariables(
            login,
            password,
            task.processInstanceId,
            setProcessVars,
            showError);
    }, [task.processInstanceId]);

    const onSave = (outputVars: Map<string, CamundaInputVar>|undefined) => {
        updateCamundaTask(
            login,
            password,
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