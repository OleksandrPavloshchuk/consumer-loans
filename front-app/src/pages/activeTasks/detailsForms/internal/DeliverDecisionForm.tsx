import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, Paper, Stack, Table} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";
import {useApplicationState} from "../../../../ApplicationState.ts";
import {getLocalization} from "../../../../i18n/language.ts";

export const renderDeliverDecisionForm = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar>|undefined) => void
) => {

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    return (
        <>
            <Table>
                <Table.Tbody>
                    <BaseLoanInfo processVars={processVars}/>
                    <LoanDecisionInfo processVars={processVars}/>
                    <Table.Tr>
                        <Table.Td>{loc.field.decision}</Table.Td>
                        <Table.Td>{loc.decision[processVars?.decision?.value]}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
            <Paper p="xs">
                <Stack gap="xs">
                    <Button onClick={() => onSave(undefined)}>{loc.action.completeTask}</Button>
                </Stack>
            </Paper>
        </>
    );
};