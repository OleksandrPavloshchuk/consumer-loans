import {useCamundaTaskList} from "../../../camundaClient/CamundaTaskList.ts";
import {Button, NumberInput, Paper, Stack, Table, TextInput} from "@mantine/core";
import {showError} from "../../../utils/utils.ts";
import {useEffect, useState} from "react";
import {type CamundaInputVar, updateCamundaTask} from "../../../camundaClient/CamundaUpdateTask.ts";
import {CamundaTaskInfo} from "./parts/CamundaTaskInfo.tsx";
import {CamundaProcessVars, type CamundaTask} from "../../../camundaClient/domain.ts";
import {getCamundaProcessVariables} from "../../../camundaClient/CamundaProcessVariables.ts";

type Props = {
    task: CamundaTask,
    closeTab: (taskId: string) => void
};

interface DetailsInput {
    personName: string;
    amount: number
}

export const EnterApplicationForm: React.FC<Props> = ({task, closeTab}) => {

    const [processVars, setProcessVars] = useState<CamundaProcessVars|undefined>(undefined);

    const doRefresh = useCamundaTaskList((s) => s.doRefresh);

    const [detailsInput, setDetailsInput] = useState<DetailsInput>({
        personName: task?.processVariables?.personName?.value ?? "",
        amount: task?.processVariables?.amount?.value ?? 0
    });

    const onSave = () => {

        const vars = new Map<string, CamundaInputVar>();
        vars.set("personName", {value: detailsInput.personName, type: "String", local: false});
        vars.set("amount", {value: detailsInput.amount, type: "Double", local: false});

        updateCamundaTask(
            task.id,
            vars,
            closeTab,
            doRefresh,
            showError
        );
    };

    const setPersonName = (s: string) => {
        setDetailsInput((prev) => ({...prev, personName: s}));
    }

    const setAmount = (n: number) => {
        setDetailsInput((prev) => ({...prev, amount: n}));
    }

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
                <Table.Tr>
                    <Table.Td>Ідентифікатор позички</Table.Td>
                    <Table.Td>{processVars?.businessKey?.value}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
        <Paper p="xs">
            <Stack gap="xs">
                <div className="field-label">Особа:</div>
                <TextInput
                    value={detailsInput.personName}
                    onChange={(e) => setPersonName(e.currentTarget.value)}
                />
                <div className="field-label">Сума:</div>
                <NumberInput
                    min={0}
                    max={1_000_000}
                    thousandSeparator={" "}
                    value={detailsInput.amount}
                    onChange={(value) => {
                        if (typeof value === "number") {
                            setAmount(value);
                        }
                    }}
                />
                <Button onClick={onSave}>Ввести дані позички</Button>
            </Stack>
        </Paper>
    </>);
}