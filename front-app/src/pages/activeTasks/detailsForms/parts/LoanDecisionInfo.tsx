import {Table} from "@mantine/core";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {stringList} from "./StringList.tsx";
import * as React from "react";
import {useApplicationState} from "../../../../ApplicationState.ts";
import {getLocalization} from "../../../../i18n/language.ts";

type Props = {
    processVars: CamundaProcessVars | undefined
}

export const LoanDecisionInfo: React.FC<Props> = ({processVars}) => {

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    return (<>
        <Table.Tr>
            <Table.Td>{loc.field.scoringResult}</Table.Td>
            <Table.Td>{loc.scoringResult[processVars?.scoringResult?.value]}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>{loc.field.personCheckScores}</Table.Td>
            <Table.Td>{processVars?.personCheckScores?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>{loc.field.personCheckReasons}</Table.Td>
            <Table.Td>{stringList(processVars?.personCheckReasons?.value)}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>{loc.field.financeCheckScores}</Table.Td>
            <Table.Td>{processVars?.financeCheckScores?.value}</Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>{loc.field.personCheckReasons}</Table.Td>
            <Table.Td>{stringList(processVars?.financeCheckReasons?.value)}</Table.Td>
        </Table.Tr>
    </>)};
