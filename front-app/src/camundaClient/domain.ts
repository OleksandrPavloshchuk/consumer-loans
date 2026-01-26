export class CamundaVar<T> {
    value!: T
}

export class CamundaProcessVars {
    personCheckScores?: CamundaVar<number>;
    personCheckReasons?: CamundaVar<string[]>;
    financeCheckScores?: CamundaVar<number>;
    financeCheckReasons?: CamundaVar<string[]>;
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
}

export class ArchiveRecord {
    id: string = "";
    processInstanceId: string = "";
    startTime: string = "";
    endTime: string | undefined = undefined;
    durationInMillis: number;
    state: string | undefined;
}

export class ArchiveVar {
    name: string;
    value: any;
}

export const getFieldLabel = (name: string) => {
    switch (name) {
        case "businessKey": return "Бізнес-ключ";
        case "personName": return "Позичальник";
        case "amount": return "Сума позички";
        case "personCheckScores": return "Рейтинг перевірки особи";
        case "personCheckReasons": return "Деталі перевірки особи";
        case "financeCheckScores": return "Рейтинг перевірки фінансів";
        case "financeCheckReasons": return "Деталі перевірки фінансів";
        case "totalScores": return "Загальний рейтинг перевірки";
        case "totalReasons": return "Загальні деталі перевірки";
        case "scoringResult": return "Результат перевірки";
        case "decision": return "Рішення";
        default: return undefined;
    }
}