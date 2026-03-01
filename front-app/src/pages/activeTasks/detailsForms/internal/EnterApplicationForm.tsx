import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, NumberInput, TextInput} from "@mantine/core";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocalization} from "../../../../i18n/useLocalization.ts";
import {createDetailsCard} from "../../../../lib/controls.tsx";

interface DetailsInput {
    personName: string;
    amount: number
}

type Props = {
    processVars: CamundaProcessVars | undefined,
    onSave: (outputVars: Map<string, CamundaInputVar>) => void
}

export const EnterApplicationForm: React.FC<Props> = ({processVars, onSave}) => {

    const [detailsInput, setDetailsInput] = useState<DetailsInput>({
        personName: processVars?.personName?.value ?? "",
        amount: processVars?.amount?.value ?? 1
    });
    const getOutputVars = () => {
        const vars = new Map<string, CamundaInputVar>();
        vars.set("personName", {value: detailsInput.personName, type: "String", local: false});
        vars.set("amount", {value: detailsInput.amount, type: "Double", local: false});
        return vars;
    };

    const [personNameError, setPersonNameError] = useState<string | undefined>(undefined);
    const [amountError, setAmountError] = useState<string | undefined>(undefined);

    useEffect(() => validatePersonName(), [detailsInput.personName]);
    useEffect(() => validateAmount(), [detailsInput.amount]);

    const loc = useLocalization();

    const validatePersonName = () => {
        const s = detailsInput.personName;
        if (s.trim() === "") {
            setPersonNameError(loc.error.personName.empty);
        } else if (s.length > 100) {
            setPersonNameError(loc.error.personName.tooLong);
        } else {
            setPersonNameError(undefined);
        }
    };

    const setPersonName = (s: string) => {
        setDetailsInput((prev) => ({...prev, personName: s}));
    }

    const validateAmount = () => {
        const n = detailsInput.amount;
        if (!n || n <= 0) {
            setAmountError(loc.error.amount.invalid);
        } else {
            setAmountError(undefined);
        }
    };

    const setAmount = (n: number) => {
        setDetailsInput((prev) => ({...prev, amount: n}));
    }

    const save = () => {
        if (!personNameError && !amountError) {
            onSave(getOutputVars());
        }
    }

    return (
        <>
            {createDetailsCard(loc.field.loanId, processVars?.businessKey?.value)}
            <div className={"card-details-item"}>
                <div className="label">{loc.field.personName}:</div>
                <TextInput
                    withAsterisk
                    error={personNameError}
                    value={detailsInput.personName}
                    onChange={(e) => setPersonName(e.currentTarget.value)}
                />
            </div>
            <div className={"card-details-item"}>
                <div className="label">{loc.field.amount}:</div>
                <NumberInput
                    error={amountError}
                    min={1}
                    max={1_000_000}
                    thousandSeparator={" "}
                    value={detailsInput.amount}
                    onChange={(value) => {
                        if (typeof value === "number") {
                            setAmount(value);
                        }
                    }}
                />
            </div>
            <div className={"card-details-item"}>
                <Button onClick={save}>{loc.action.enterLoanData}</Button>
            </div>
        </>
    );
}