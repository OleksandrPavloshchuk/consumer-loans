import {Button, Paper, Stack, Table} from "@mantine/core";
import {CamundaTaskInfo} from "./parts/CamundaTaskInfo.tsx";
import {BaseLoanInfo} from "./parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "./parts/LoanDecisionInfo.tsx";
import {CamundaProcessVars, type CamundaTask} from "../../../camundaClient/domain.ts";
import {useEffect, useState} from "react";
import {getCamundaProcessVariables} from "../../../camundaClient/CamundaProcessVariables.ts";
import {showError} from "../../../utils/utils.ts";
import {type CamundaInputVar, updateCamundaTask} from "../../../camundaClient/CamundaUpdateTask.ts";
import {useCamundaTaskList} from "../../../camundaClient/CamundaTaskList.ts";

type Props = {
    task: CamundaTask,
    closeTab: (taskId: string) => void
};

export const DeliverDecisionForm: React.FC<Props> = ({task, closeTab}) => {

    const [processVars, setProcessVars] = useState<CamundaProcessVars|undefined>(undefined);

    const doRefresh = useCamundaTaskList((s) => s.doRefresh);

    useEffect(() => {
        return getCamundaProcessVariables(
            task.processInstanceId,
            setProcessVars,
            showError);
    }, [task.processInstanceId]);

    const onSave = () => {

        updateCamundaTask(
            task.id,
            new Map<string, CamundaInputVar>(),
            closeTab,
            doRefresh,
            showError
        );
    };

    return (<>
        <CamundaTaskInfo task={task}/>
        <hr/>
        <Table>
            <Table.Tbody>
                <BaseLoanInfo processVars={processVars} />
                <LoanDecisionInfo processVars={processVars} />
                <Table.Tr>
                    <Table.Td>Рішення</Table.Td>
                    <Table.Td>{processVars?.decision?.value}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
        <Paper p="xs">
            <Stack gap="xs">
                <Button onClick={onSave}>Закінчити задачу</Button>
            </Stack>
        </Paper>
    </>);
}