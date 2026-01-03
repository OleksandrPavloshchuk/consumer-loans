import {useCamundaTaskList} from "../../../camundaClient/CamundaTaskList.ts";
import {Button, Paper, Stack, Table} from "@mantine/core";
import {showError} from "../../../utils/utils.ts";
import {type CamundaInputVar, updateCamundaTask} from "../../../camundaClient/CamundaUpdateTask.ts";
import {CamundaTaskInfo} from "./parts/CamundaTaskInfo.tsx";
import {BaseLoanInfo} from "./parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "./parts/LoanDecisionInfo.tsx";
import {CamundaProcessVars, CamundaTask} from "../../../camundaClient/domain.ts";
import {useEffect, useState} from "react";
import {getCamundaProcessVariables} from "../../../camundaClient/CamundaProcessVariables.ts";

type Props = {
    task: CamundaTask,
    closeTab: (taskId: string) => void
};

export const ManualReviewForm: React.FC<Props> = ({task, closeTab}) => {

    const [processVars, setProcessVars] = useState<CamundaProcessVars|undefined>(undefined);

    const doRefresh = useCamundaTaskList((s) => s.doRefresh);

    const onSave = (decision: string) => {

        const vars = new Map<string, CamundaInputVar>();
        vars.set("decision", {value: decision, type: "String", local: false});

        updateCamundaTask(
            task.id,
            vars,
            closeTab,
            doRefresh,
            showError
        );
    };

    useEffect(() => {
        return getCamundaProcessVariables(
            task.processInstanceId,
            setProcessVars,
            showError)
    }, [task.processInstanceId]);

    return (<>
        <CamundaTaskInfo task={task}/>
        <hr/>
        <Table>
            <Table.Tbody>
                <BaseLoanInfo processVars={processVars} />
                <LoanDecisionInfo processVars={processVars}/>
            </Table.Tbody>
        </Table>
        <Paper p="xs">
            <Stack gap="xs">
                <Button onClick={()=>onSave("APPROVE")}>Видати позичку</Button>
                <Button onClick={()=>onSave("REJECT")}>Відхилити заявку</Button>
            </Stack>
        </Paper>
    </>);
}