import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {toCurrency} from "../../../../lib/utils.ts";
import * as React from "react";
import {getLocalization} from "../../../../i18n/language.ts";
import {useApplicationState} from "../../../../ApplicationState.ts";

type Props = {
    processVars: CamundaProcessVars|undefined
}

export const BaseLoanInfo: React.FC<Props> = ({processVars}) => {

    const language = useApplicationState((s) => s.language);
    const loc = getLocalization(language);

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