export class CamundaVar<T> {
    value!: T
}

export class CamundaProcessVars {
    scoringResult?: CamundaVar<string>;
    decision?: CamundaVar<string>;
    businessKey?: CamundaVar<string>;
    personName?: CamundaVar<string>;
    amount?: CamundaVar<number>
}

export class CamundaTask {
    id: string = "";
    name: string = "";
    created: string = "";
    lastUpdated: string | undefined = undefined;
    processInstanceId: string = "";
    taskDefinitionKey: string = "";
    processVariables?: CamundaProcessVars
}
