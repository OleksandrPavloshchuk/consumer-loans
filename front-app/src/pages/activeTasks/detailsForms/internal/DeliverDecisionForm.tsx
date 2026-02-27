import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";
import {useApplicationState} from "../../../../ApplicationState.ts";
import {getLocalization, localized} from "../../../../i18n/language.ts";

export const renderDeliverDecisionForm = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar> | undefined) => void
) => {

    const language = useApplicationState((s) => s.language);
    let loc = getLocalization(language);

    return (
        <>
            <BaseLoanInfo processVars={processVars}/>
            <LoanDecisionInfo processVars={processVars}/>
            <div className={"card-details-item"}>
                <div className={"label"}>{loc.field.decision}</div>
                <div>{localized(loc.decision, processVars?.decision?.value)}</div>
            </div>
            <div className={"card-details-item"}>
                <Button onClick={() => onSave(undefined)}>{loc.action.completeTask}</Button>
            </div>
        </>
    );
};