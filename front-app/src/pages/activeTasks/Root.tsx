import {Button, Flex} from "@mantine/core";
import {notify, showError} from "../../utils/utils.ts";
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
import {TabbedPage} from "../lib/TabbedPage.tsx";

export const ActiveTasksRoot: React.FC = () => {

    const doRefresh = useCamundaTaskList((s) => s.doRefresh);
    const createNewTask = () => createNewCamundaTask(doRefresh, showError);

    const roles = useAuthorizationState((s) => s.groups);
    const isLoanConsultant = () => roles.includes("loanConsultants");

    const renderListTab = (openTab: (item: TabbedPageItem) => void) => (<>
        <Flex w="100%" gap="sm">
            {isLoanConsultant() &&
                <Button onClick={createNewTask}>Нова позичка</Button>
            }
            <Button onClick={doRefresh}>Оновити список</Button>
        </Flex>
        <ActiveTasksMainTable openTask={openTab}/>
    </>);

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
            getDetailsTabTitle={(item: TabbedPageItem) => (item as CamundaTask).name}
            renderListTab={renderListTab}
            renderDetailsTab={renderDetailsTab}
        />);
}
