import type {Language} from "../i18n/language.ts";
import {getLocalization} from "../i18n/language.ts";

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

export class TabbedPageItem {
    id: string = "";
    constructor(id: string) {
        this.id = id;
    }
}

export class CamundaTask extends TabbedPageItem {
    name: string = "";
    created: string = "";
    lastUpdated: string | undefined = undefined;
    processInstanceId: string = "";
    taskDefinitionKey: string = "";
}

export class ArchiveRecord extends TabbedPageItem {
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

export const getFieldIndex = (name: string) => {
    switch (name) {
        case "businessKey": return 0;
        case "personName": return 1;
        case "amount": return 2;
        case "personCheckScores": return 3;
        case "personCheckReasons": return 4;
        case "financeCheckScores": return 5;
        case "financeCheckReasons": return 6;
        case "totalScores": return 7;
        case "totalReasons": return 8;
        case "scoringResult": return 9;
        case "decision": return 10;
        default: return undefined;
    }
}