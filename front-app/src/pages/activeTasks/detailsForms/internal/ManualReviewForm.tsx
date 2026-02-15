import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, Paper, Stack, Table} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";
import {useApplicationState} from "../../../../ApplicationState.ts";
import {getLocalization} from "../../../../i18n/language.ts";

export const renderManualReviewForm = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar>) => void
) => {

    const getOutputVars = (decision: string) => {
        const vars = new Map<string, CamundaInputVar>();
        vars.set("decision", {value: decision, type: "String", local: false});
        return vars;
    };

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    return (
        <>
            <Table>
                <Table.Tbody>
                    <BaseLoanInfo processVars={processVars} />
                    <LoanDecisionInfo processVars={processVars}/>
                </Table.Tbody>
            </Table>
            <Paper p="xs">
                <Stack gap="xs">
                    <Button onClick={()=>onSave(getOutputVars("APPROVE"))}>{loc.action.approveLoan}</Button>
                    <Button onClick={()=>onSave(getOutputVars("REJECT"))}>{loc.action.rejectLoan}</Button>
                </Stack>
            </Paper>
        </>
    );
};