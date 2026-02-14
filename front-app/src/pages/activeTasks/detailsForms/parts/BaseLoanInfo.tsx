import {Table} from "@mantine/core";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {toCurrency} from "../../../../lib/utils.ts";
import * as React from "react";
import {useApplicationState} from "../../../../ApplicationState.ts";
import {getLocalization} from "../../../../i18n/language.ts";

type Props = {
    processVars: CamundaProcessVars|undefined
}

export const BaseLoanInfo: React.FC<Props> = ({processVars}) => {

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    return (<>
        <Table.Tr>
            <Table.Td>{loc.field.loanId}</Table.Td>
            <Table.Td>{processVars?.businessKey?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>{loc.field.personName}</Table.Td>
            <Table.Td>{processVars?.personName?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>{loc.field.amount}</Table.Td>
            <Table.Td>{toCurrency(processVars?.amount?.value)}</Table.Td>
        </Table.Tr>
    </>);
}