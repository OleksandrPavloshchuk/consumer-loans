import {ScrollArea} from "@mantine/core";
import {showError, toLocalDateTime} from "../../lib/utils.ts";
import {useCamundaTaskList} from "../../camundaClient/taskList.ts";
import * as React from "react";
import {useEffect} from "react";
import type {CamundaTask} from "../../camundaClient/domain.ts";
import {localized, useLocalization} from "../../i18n/language.ts";

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

    const loc = useLocalization();

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
                        <div className="label">{loc.field.loanId}</div>
                        <div>{item.id}</div>
                        <div className="label">{loc.field.stateName}</div>
                        <div>{localized(loc.loanStatus, item.name)}</div>
                        <div className="label">{loc.field.processId}</div>
                        <div>{item.processInstanceId}</div>
                        <div className="label">{loc.field.claimTimestamp}</div>
                        <div>{toLocalDateTime(item.created)}</div>
                    </div>)
            }</div>
        </ScrollArea>
    );

}