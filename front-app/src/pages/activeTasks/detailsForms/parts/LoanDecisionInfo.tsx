import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {stringList} from "./StringList.tsx";
import * as React from "react";
import {localized} from "../../../../i18n/language.ts";
import {useLocalization} from "../../../../i18n/useLocalization.ts";

type Props = {
    processVars: CamundaProcessVars | undefined
}

export const LoanDecisionInfo: React.FC<Props> = ({processVars}) => {

    const loc = useLocalization();

    return (<>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.scoringResult}</div>
            <div>{localized(loc.scoringResult, processVars?.scoringResult?.value)}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.personCheckScores}</div>
            <div>{processVars?.personCheckScores?.value}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.personCheckReasons}</div>
            <div>{stringList(processVars?.personCheckReasons?.value)}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.financeCheckScores}</div>
            <div>{processVars?.financeCheckScores?.value}</div>
        </div>
        <div className={"card-details-item"}>
            <div className={"label"}>{loc.field.financeCheckReasons}</div>
            <div>{stringList(processVars?.financeCheckReasons?.value)}</div>
        </div>
    </>)};
