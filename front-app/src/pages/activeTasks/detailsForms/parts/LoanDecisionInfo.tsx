import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import * as React from "react";
import {localized} from "../../../../i18n/language.ts";
import {useLocalization} from "../../../../i18n/useLocalization.ts";
import {createDetailsCard, stringList} from "../../../../lib/controls.tsx";

type Props = {
    processVars: CamundaProcessVars | undefined
}

export const LoanDecisionInfo: React.FC<Props> = ({processVars}) => {

    const loc = useLocalization();

    return (<>
        {createDetailsCard(loc.field.scoringResult, localized(loc.scoringResult, processVars?.scoringResult?.value))}
        {createDetailsCard(loc.field.personCheckScores, processVars?.personCheckScores?.value)}
        {createDetailsCard(loc.field.personCheckReasons, stringList(processVars?.personCheckReasons?.value))}
        {createDetailsCard(loc.field.financeCheckScores, processVars?.financeCheckScores?.value)}
        {createDetailsCard(loc.field.financeCheckReasons, stringList(processVars?.financeCheckReasons?.value))}
    </>)};
