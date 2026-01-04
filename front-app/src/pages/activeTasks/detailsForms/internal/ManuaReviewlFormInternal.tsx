import type {CamundaInputVar} from "../../../../camundaClient/CamundaUpdateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, Paper, Stack, Table} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";

export const renderManualReviewFormInternal = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar>) => void
) => {

    const getOutputVars = (decision: string) => {
        const vars = new Map<string, CamundaInputVar>();
        vars.set("decision", {value: decision, type: "String", local: false});
        return vars;
    };

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
                    <Button onClick={()=>onSave(getOutputVars("APPROVE"))}>Видати позичку</Button>
                    <Button onClick={()=>onSave(getOutputVars("REJECT"))}>Відхилити заявку</Button>
                </Stack>
            </Paper>
        </>
    );
};