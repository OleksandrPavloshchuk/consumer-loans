import {ActionIcon, Button, CloseIcon, Flex, Tabs} from "@mantine/core";
import {notify, showError} from "../../utils/utils.ts";
import {ActiveTasksMainTable} from "./MainTable.tsx";
import {useState} from "react";
import {useCamundaTaskList} from "../../camundaClient/CamundaTaskList.ts";
import {createNewCamundaTask} from "../../camundaClient/CamundaNewProcess.ts";
import type {CamundaTask} from "../../camundaClient/domain.ts";
import {DetailsFormsBase} from "./detailsForms/DetailsFormBase.tsx";
import {renderDeliverDecisionFormInternal} from "./detailsForms/internal/DeliverDecisionFormInternal.tsx";
import {renderManualReviewFormInternal} from "./detailsForms/internal/ManuaReviewlFormInternal.tsx";
import {
    EnterApplicationFormInternal
} from "./detailsForms/internal/EnterApplicationFormInternal.tsx";

export const ActiveTasksRoot: React.FC = () => {

    const doRefresh = useCamundaTaskList((s) => s.doRefresh);

    const [activeTab, setActiveTab] = useState<string | null>("list");
    const [openTasks, setOpenTasks] = useState<CamundaTask[]>([]);

    const openTaskTab = (task: CamundaTask) => {
        if (!openTasks.find((item) => task.id == item.id)) {
            setOpenTasks([...openTasks, task]);
        }
        setActiveTab(task.id ? task.id : null);
    };

    const closeTaskTab = (taskId: string) => {
        setOpenTasks(prev => prev.filter(item => item.id !== taskId));

        setActiveTab(current =>
            current === taskId ? "list" : current
        );
    }

    const createNewTask = () =>
        createNewCamundaTask(doRefresh, showError);

    const getTaskForm = (task: CamundaTask) => {
        switch (task.taskDefinitionKey) {
            case "enterApplication":
                return <DetailsFormsBase
                    task={task} closeTab={closeTaskTab}
                    renderFormInternal={
                        (processVars, onSave) =>
                            <EnterApplicationFormInternal processVars={processVars} onSave={onSave}/>}/>;
            case "manualReview":
                return <DetailsFormsBase
                    task={task} closeTab={closeTaskTab}
                    renderFormInternal={renderManualReviewFormInternal}/>;
            case "deliverDecision":
                return <DetailsFormsBase
                    task={task} closeTab={closeTaskTab}
                    renderFormInternal={renderDeliverDecisionFormInternal}/>;
            default:
                notify("TODO", "form is not ready");
        }
    }

    return (
        <Tabs defaultValue={"list"} value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab key="list" value={"list"}>Список активних позичок</Tabs.Tab>
                {
                    openTasks.map((task) =>
                        (<Tabs.Tab key={task.id} value={task.id}>
                            {`${task.name}`}&nbsp;
                            <ActionIcon
                                component="span"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    closeTaskTab(task.id);
                                }}
                                variant="light"
                                size="xs">
                                <CloseIcon/>
                            </ActionIcon>
                        </Tabs.Tab>))
                }
            </Tabs.List>
            <Tabs.Panel value={"list"} mt={"md"}>
                <Flex w="100%" gap="sm">
                    <Button
                        onClick={createNewTask}
                    >Нова позичка</Button>
                    <Button
                        onClick={doRefresh}
                    >Оновити список</Button>
                </Flex>
                <ActiveTasksMainTable openTask={openTaskTab}/>
            </Tabs.Panel>
            {
                openTasks.map((task) =>
                    (<Tabs.Panel key={task.id} value={task.id}>{getTaskForm(task)}</Tabs.Panel>))
            }
        </Tabs>);
}
