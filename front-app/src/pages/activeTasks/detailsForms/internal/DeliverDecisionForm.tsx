import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";
import {localized} from "../../../../i18n/language.ts";
import {useLocalization} from "../../../../i18n/useLocalization.ts";

export const renderDeliverDecisionForm = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar> | undefined) => void
) => {

    const loc = useLocalization();

    const getDecisionCssClass = () =>
        processVars?.decision?.value === 'APPROVE' ? 'approve' : 'reject';

    return (
        <>
            <BaseLoanInfo processVars={processVars}/>
            <LoanDecisionInfo processVars={processVars}/>
            <div className={`card-details-item ${getDecisionCssClass()}`}>
                <div className={"label"}>{loc.field.decision}</div>
                <div>{localized(loc.decision, processVars?.decision?.value)}</div>
            </div>
            <div className={"card-details-item"}>
                <Button onClick={() => onSave(undefined)}>{loc.action.completeTask}</Button>
            </div>
        </>
    );
};