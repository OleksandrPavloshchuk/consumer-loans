import {Button, Flex, Paper, Stack} from "@mantine/core";
import {getActiveTaskTitle, notify, showError} from "../../lib/utils.ts";
import {ActiveTasksMainTable} from "./MainTable.tsx";
import {useCamundaTaskList} from "../../camundaClient/taskList.ts";
import {createNewCamundaTask} from "../../camundaClient/newProcess.ts";
import type {CamundaTask} from "../../camundaClient/domain.ts";
import {TabbedPageItem} from "../../camundaClient/domain.ts";
import {DetailsFormsBase} from "./detailsForms/DetailsFormBase.tsx";
import {renderDeliverDecisionForm} from "./detailsForms/internal/DeliverDecisionForm.tsx";
import {renderManualReviewForm} from "./detailsForms/internal/ManualReviewForm.tsx";
import {EnterApplicationForm} from "./detailsForms/internal/EnterApplicationForm.tsx";
import {useAuthorizationState} from "../../authentication/AuthorizationState.ts";
import {TabbedPage} from "../../lib/TabbedPage.tsx";
import * as React from "react";
import {SortDropdown} from "../../lib/SortDropdown.tsx";
import {useLocalization} from "../../i18n/useLocalization.ts";

export const ActiveTasksRoot: React.FC = () => {

    const doRefresh = useCamundaTaskList((s) => s.doRefresh);
    const createNewTask = () => createNewCamundaTask(doRefresh, showError);
    const createdOrder = useCamundaTaskList((s) => s.createdOrder);
    const setCreatedOrder = useCamundaTaskList((s) => s.setCreatedOrder);

    const roles = useAuthorizationState((s) => s.groups);
    const isLoanConsultant = () => roles.includes("loanConsultants");

    const loc = useLocalization();

    const renderListTab = (openTab: (item: TabbedPageItem) => void) => (<Stack>
        <Paper shadow="sm" p="xs">
            <Flex w="100%" gap="sm" align="center">
                {isLoanConsultant() &&
                    <Button onClick={createNewTask}>{loc.page.activeTasks.newLoan}</Button>
                }
                <Button onClick={doRefresh}>{loc.page.activeTasks.refresh}</Button>
                <span className={"custom-label"}>{`${loc.sort.label}: `}</span>
                <SortDropdown value={createdOrder} setValue={setCreatedOrder} />
            </Flex>
        </Paper>
        <ActiveTasksMainTable openTask={openTab}/>
    </Stack>);

    const getTaskForm = (task: CamundaTask, closeTab: (id: string) => void) => {
        switch (task.taskDefinitionKey) {
            case "enterApplication":
                return <DetailsFormsBase
                    task={task} closeTab={closeTab}
                    renderFormInternal={
                        (processVars, onSave) =>
                            <EnterApplicationForm processVars={processVars} onSave={onSave}/>}/>;
            case "manualReview":
                return <DetailsFormsBase
                    task={task} closeTab={closeTab}
                    renderFormInternal={renderManualReviewForm}/>;
            case "deliverDecision":
                return <DetailsFormsBase
                    task={task} closeTab={closeTab}
                    renderFormInternal={renderDeliverDecisionForm}/>;
            default:
                notify("TODO", "form is not ready");
        }
    }
    const renderDetailsTab = (item: TabbedPageItem, closeTab: (id: string) => void) => getTaskForm(item as CamundaTask, closeTab);

    return (
        <TabbedPage
            pageId={"activeTasks"}
            getDetailsTabTitle={(item: TabbedPageItem) => getActiveTaskTitle(loc, item as CamundaTask)}
            renderListTab={renderListTab}
            renderDetailsTab={renderDetailsTab}
        />);
}
