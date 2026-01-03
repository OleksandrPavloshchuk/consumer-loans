import {Table} from "@mantine/core";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";

type Props = {
    processVars: CamundaProcessVars|undefined
}

// TODO add person and finance check results and reasons

export const LoanDecisionInfo: React.FC<Props> = ({processVars}) => (
    <>
        <Table.Tr>
            <Table.Td>Результат автоматичного скорінгу</Table.Td>
            <Table.Td>{processVars?.scoringResult?.value}</Table.Td>
        </Table.Tr>
    </>
)