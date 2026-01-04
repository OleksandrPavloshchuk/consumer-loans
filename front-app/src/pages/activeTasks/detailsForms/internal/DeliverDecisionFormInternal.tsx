import type {CamundaInputVar} from "../../../../camundaClient/CamundaUpdateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, Paper, Stack, Table} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";

export const renderDeliverDecisionFormInternal = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar>) => void
) => {

    const getOutputVars = () =>
        new Map<string, CamundaInputVar>();

    return (
        <>
            <Table>
                <Table.Tbody>
                    <BaseLoanInfo processVars={processVars}/>
                    <LoanDecisionInfo processVars={processVars}/>
                    <Table.Tr>
                        <Table.Td>Рішення</Table.Td>
                        <Table.Td>{processVars?.decision?.value}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
            <Paper p="xs">
                <Stack gap="xs">
                    <Button onClick={() => onSave(getOutputVars())}>Закінчити задачу</Button>
                </Stack>
            </Paper>
        </>
    );
};