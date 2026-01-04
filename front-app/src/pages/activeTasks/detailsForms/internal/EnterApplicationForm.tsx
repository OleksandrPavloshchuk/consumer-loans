import type {CamundaInputVar} from "../../../../camundaClient/updateTask.ts";
import type {CamundaProcessVars} from "../../../../camundaClient/domain.ts";
import {Button, NumberInput, Paper, Stack, Table, TextInput} from "@mantine/core";
import {useState} from "react";

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

    return (
        <>
            <Table>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td>Ідентифікатор позички</Table.Td>
                        <Table.Td>{processVars?.businessKey?.value}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
            <Paper p="xs">
                <Stack gap="xs">
                    <div className="field-label">Особа:</div>
                    <TextInput
                        value={detailsInput.personName}
                        onChange={(e) => setPersonName(e.currentTarget.value)}
                    />
                    <div className="field-label">Сума:</div>
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
                    <Button onClick={() => onSave(getOutputVars())}>Ввести дані позички</Button>
                </Stack>
            </Paper>
        </>
    );
}