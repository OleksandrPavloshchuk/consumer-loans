import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button} from "@mantine/core";
import {BaseLoanInfo} from "../parts/BaseLoanInfo.tsx";
import {LoanDecisionInfo} from "../parts/LoanDecisionInfo.tsx";
import {useLocalization} from "../../../../i18n/useLocalization.ts";

export const renderManualReviewForm = (
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar>) => void
) => {

    const getOutputVars = (decision: string) => {
        const vars = new Map<string, CamundaInputVar>();
        vars.set("decision", {value: decision, type: "String", local: false});
        return vars;
    };

    const loc = useLocalization();

    return (
        <>
            <BaseLoanInfo processVars={processVars}/>
            <LoanDecisionInfo processVars={processVars}/>
            <div className={"card-details-item approve"}>
                <Button onClick={() => onSave(getOutputVars("APPROVE"))}>{loc.action.approveLoan}</Button>
            </div>
            <div className={"card-details-item reject"}>
                <Button onClick={() => onSave(getOutputVars("REJECT"))}>{loc.action.rejectLoan}</Button>
            </div>
        </>
    );
};