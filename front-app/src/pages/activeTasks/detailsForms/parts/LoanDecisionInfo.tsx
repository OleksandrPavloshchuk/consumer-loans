import {Table} from "@mantine/core";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {stringList} from "./StringList.tsx";

type Props = {
    processVars: CamundaProcessVars | undefined
}

export const LoanDecisionInfo: React.FC<Props> = ({processVars}) =>
    <>
        <Table.Tr>
            <Table.Td>Результат автоматичного скорінгу</Table.Td>
            <Table.Td>{processVars?.scoringResult?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td colSpan={2}>Скорінг особи</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>- результат:</Table.Td>
            <Table.Td>{processVars?.personCheckScores?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>- причини:</Table.Td>
            <Table.Td>{stringList(processVars?.personCheckReasons?.value)}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td colSpan={2}>Скорінг фінансів</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>- результат:</Table.Td>
            <Table.Td>{processVars?.financeCheckScores?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>- причини:</Table.Td>
            <Table.Td>{stringList(processVars?.financeCheckReasons?.value)}</Table.Td>
        </Table.Tr>
    </>;
