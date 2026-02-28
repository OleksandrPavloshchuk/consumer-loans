import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, NumberInput, TextInput} from "@mantine/core";
import * as React from "react";
import {useState} from "react";
import {getLocalization} from "../../../../i18n/language.ts";
import {useApplicationState} from "../../../../ApplicationState.ts";

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
        amount: processVars?.amount?.value ?? 0
    });

    const getOutputVars = () => {
        const vars = new Map<string, CamundaInputVar>();
        vars.set("personName", {value: detailsInput.personName, type: "String", local: false});
        vars.set("amount", {value: detailsInput.amount, type: "Double", local: false});
        return vars;
    };

    const setPersonName = (s: string) => {
        setDetailsInput((prev) => ({...prev, personName: s}));
    }

    const setAmount = (n: number) => {
        setDetailsInput((prev) => ({...prev, amount: n}));
    }

    const language = useApplicationState((s) => s.language);
    const loc = getLocalization(language);

    return (
        <>
            <div className={"card-details-item"}>
                <div className={"label"}>{loc.field.loanId}</div>
                <div>{processVars?.businessKey?.value}</div>
            </div>
            <div className={"card-details-item"}>
                <div className="label">{loc.field.personName}:</div>
                <TextInput
                    value={detailsInput.personName}
                    onChange={(e) => setPersonName(e.currentTarget.value)}
                />
            </div>
            <div className={"card-details-item"}>
                <div className="label">{loc.field.amount}:</div>
                <NumberInput
                    min={0}
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
                <Button onClick={() => onSave(getOutputVars())}>{loc.action.enterLoanData}</Button>
            </div>
        </>
    );
}