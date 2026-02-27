import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {toCurrency} from "../../../../lib/utils.ts";
import * as React from "react";
import {useLocalization} from "../../../../i18n/language.ts";

type Props = {
    processVars: CamundaProcessVars|undefined
}

export const BaseLoanInfo: React.FC<Props> = ({processVars}) => {

    const loc = useLocalization();

    return (<>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.loanId}</div>
            <div>{processVars?.businessKey?.value}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.personName}</div>
            <div>{processVars?.personName?.value}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.amount}</div>
            <div>{toCurrency(processVars?.amount?.value)}</div>
        </div>
    </>);
}