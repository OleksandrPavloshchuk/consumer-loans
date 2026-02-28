import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {toCurrency} from "../../../../lib/utils.ts";
import * as React from "react";
import {useLocalization} from "../../../../i18n/useLocalization.ts";
import {createDetailsCard} from "../../../../lib/controls.tsx";

type Props = {
    processVars: CamundaProcessVars|undefined
}

export const BaseLoanInfo: React.FC<Props> = ({processVars}) => {

    const loc = useLocalization();

    return (<>
        {createDetailsCard(loc.field.loanId, processVars?.businessKey?.value)}
        {createDetailsCard(loc.field.personName, processVars?.personName?.value)}
        {createDetailsCard(loc.field.amount, toCurrency(processVars?.amount?.value))}
    </>);
}