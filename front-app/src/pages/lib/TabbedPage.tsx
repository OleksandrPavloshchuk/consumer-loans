import {ActionIcon, CloseIcon, Tabs} from "@mantine/core";
import {useEffect, useState} from "react";
import {TabbedPageItem} from "../../camundaClient/domain.ts";
import {type PageId, useApplicationState} from "../../ApplicationState.ts";

type Props = {
    pageId: PageId,
    getDetailsTabTitle: (item: TabbedPageItem) => string,
    renderListTab: (openTab: (item: TabbedPageItem) => void) => React.ReactNode,
    renderDetailsTab: (item: TabbedPageItem, closeTab: (id: string) => void) => React.ReactNode
}

export const TabbedPage: React.FC<Props> = ({pageId, getDetailsTabTitle, renderListTab, renderDetailsTab}) => {

    const setActivePageName = useApplicationState(
        (s) => s.setActivePageName
    );
    useEffect(() => {
        setActivePageName(pageId);
    }, [setActivePageName]);

    const [activeTab, setActiveTab] = useState<string | null>("list");
    const [openItems, setOpenItems] = useState<TabbedPageItem[]>([]);

    const openTab = (item: TabbedPageItem) => {
        if (!openItems.find((openItem) => openItem.id == item.id)) {
            setOpenItems([...openItems, item]);
        }
        setActiveTab(item.id ? item.id : null);
    };

    const closeTab = (id: string) => {
        setOpenItems(prev => prev.filter(item => item.id !== id));

        setActiveTab(current =>
            current === id ? "list" : current
        );
    }

    return (
        <Tabs defaultValue={"list"} value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab key="list" value={"list"}>Список</Tabs.Tab>
                {
                    openItems.map((item) =>
                        (<Tabs.Tab key={item.id} value={item.id}>{getDetailsTabTitle(item)}&nbsp;
                            <ActionIcon
                                component="span"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    closeTab(item.id);
                                }}
                                variant="light"
                                size="xs">
                                <CloseIcon/>
                            </ActionIcon>
                        </Tabs.Tab>))
                }
            </Tabs.List>
            <Tabs.Panel value={"list"} mt={"md"}>{renderListTab(openTab)}</Tabs.Panel>
            {
                openItems.map((item) =>
                    (<Tabs.Panel key={item.id} value={item.id}>{renderDetailsTab(item, closeTab)}</Tabs.Panel>))
            }
        </Tabs>);
}
