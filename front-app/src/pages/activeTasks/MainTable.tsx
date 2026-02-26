import {ScrollArea} from "@mantine/core";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {useCamundaTaskList} from "../../camundaClient/taskList.ts";
import * as React from "react";
import {useEffect} from "react";
import type {CamundaTask} from "../../camundaClient/domain.ts";
import {useApplicationState} from "../../ApplicationState.ts";
import {getLocalization, localized} from "../../i18n/language.ts";

type Props = {
    openTask: (task: CamundaTask) => void
}

export const ActiveTasksMainTable: React.FC<Props> = ({openTask}) => {

    const result = useCamundaTaskList((s) => s.result);
    const retrieve = useCamundaTaskList((s) => s.retrieve);
    const onRefresh = useCamundaTaskList((s) => s.onRefresh);
    const order = useCamundaTaskList((s) => s.createdOrder);

    useEffect(() => {
        retrieve(showError);
    }, []);
    useEffect(() => {
        retrieve(showError);
    }, [onRefresh, order]);

    const language = useApplicationState((s) => s.language);
    const loc = getLocalization(language);

    const getBorderStyle = (item: CamundaTask) => {
        switch (item.name) {
            case "Enter loan application":
                return "border-enter";
            default:
                return "";
        }
    };

    return (
        <ScrollArea h={720}>
            <div className="card-set">{
                result.map((item) =>
                    <div
                        key={item.id}
                        className={`card ${getBorderStyle(item)}`}
                        onClick={() => openTask(item)}
                    >
                        <div className="card-item label g-1-1">{loc.field.loanId}</div>
                        <div className="card-item g-1-2">{item.id}</div>
                        <div className="card-item label g-2-1">{loc.field.stateName}</div>
                        <div className="card-item g-2-2">{localized(loc.loanStatus, item.name)}</div>
                        <div className="card-item label g-3-1">{loc.field.processId}</div>
                        <div className="card-item g-3-2">{item.processInstanceId}</div>
                        <div className="card-item label g-4-1">{loc.field.claimTimestamp}</div>
                        <div className="card-item g-4-2">{toLocalDateTime(item.created)}</div>
                    </div>)
            }</div>
        </ScrollArea>
    );

}