import {Table} from "@mantine/core";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {toCurrency} from "../../../../utils/utils.ts";

type Props = {
    processVars: CamundaProcessVars|undefined
}

export const BaseLoanInfo: React.FC<Props> = ({processVars}) => (
    <>
        <Table.Tr>
            <Table.Td>Ідентифікатор позички</Table.Td>
            <Table.Td>{processVars?.businessKey?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>Позичальник</Table.Td>
            <Table.Td>{processVars?.personName?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>Сума</Table.Td>
            <Table.Td>{toCurrency(processVars?.amount?.value)}</Table.Td>
        </Table.Tr>
    </>
)