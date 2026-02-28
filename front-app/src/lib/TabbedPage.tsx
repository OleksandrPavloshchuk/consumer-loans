import {ActionIcon, CloseIcon, Combobox, Tabs, useCombobox} from "@mantine/core";
import * as React from "react";
import {useEffect, useState} from "react";
import {TabbedPageItem} from "../camundaClient/domain.ts";
import {type PageId, useApplicationState} from "../ApplicationState.ts";
import {DropdownArrow} from "./DropdownArrow.tsx";
import {useLocalization} from "../i18n/useLocalization.ts";

type Props = {
    pageId: PageId,
    getDetailsTabTitle: (item: TabbedPageItem) => string,
    renderListTab: (openTab: (item: TabbedPageItem) => void) => React.ReactNode,
    renderDetailsTab: (item: TabbedPageItem, closeTab: (id: string) => void) => React.ReactNode
}

export const TabbedPage: React.FC<Props> = ({pageId, getDetailsTabTitle, renderListTab, renderDetailsTab}) => {

    const setActivePageName = useApplicationState((s) => s.setActivePageName);
    useEffect(() => setActivePageName(pageId), [setActivePageName]);

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
        setActiveTab(current => current === id ? "list" : current);
    }

    const createTabHeader = (item: TabbedPageItem) =>
        <Tabs.Tab
            id={`tab-${item.id}`}
            aria-label={`tab-header-${item.id}`}
            aria-controls={`tab-panel-${item.id}`}
            key={item.id}
            value={item.id}>{getDetailsTabTitle(item)}&nbsp;
            <ActionIcon
                aria-label={`close-tab-${item.id}`}
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
        </Tabs.Tab>;

    const createTabContent = (item: TabbedPageItem) =>
        <Tabs.Panel
            aria-labelledby={`tab-${item.id}`}
            aria-label={`tab-panel-${item.id}`}
            key={item.id}
            value={item.id}>{renderDetailsTab(item, closeTab)}</Tabs.Panel>;

    const loc = useLocalization();

    return (
        <>
            <Tabs aria-label="page-tabs" defaultValue={"list"} value={activeTab} onChange={setActiveTab}>
                <Tabs.List style={{display: "flex", alignItems: "center"}}>
                    <Tabs.Tab aria-label="tab-header-list" key="list" value={"list"}>{loc.common.list}</Tabs.Tab>
                    {openItems.map(createTabHeader)}
                    <div style={{marginLeft: "auto"}}>
                        <OpenTabList
                            openItems={openItems}
                            activeTab={activeTab}
                            selectTab={openTab}
                            getDetailsTabTitle={getDetailsTabTitle}
                        />
                    </div>
                </Tabs.List>
                <Tabs.Panel aria-label="tab-panel-list" value={"list"} mt={"md"}>{renderListTab(openTab)}</Tabs.Panel>
                {openItems.map(createTabContent)}
            </Tabs>
        </>);
}

type OpenTabListProps = {
    openItems: TabbedPageItem[],
    activeTab: string | null,
    selectTab: (item: TabbedPageItem) => void,
    getDetailsTabTitle: (item: TabbedPageItem) => string
};

const OpenTabList: React.FC<OpenTabListProps> = ({openItems, activeTab, selectTab, getDetailsTabTitle}) => {

    const combobox = useCombobox();

    const handleSelect = (key: string) => {
        const item = openItems.find((i) => i.id === key);
        combobox.resetSelectedOption();
        if (item) {
            selectTab(item);
        }
        combobox.closeDropdown();
    }

    return (
        <Combobox
            width={400}
            aria-label={"open-tabs-dropdown"}
            zIndex={8000}
            store={combobox}
            onOptionSubmit={(v) => handleSelect(v)}
            styles={() => ({
                dropdown: {
                    width: "auto"
                }
            })}
        >
            <Combobox.Target>
                <DropdownArrow target={combobox} count={openItems.length}/>
            </Combobox.Target>
            <Combobox.Dropdown
                style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                }}
            >
                <Combobox.Options>
                    {
                        openItems
                            .map((item) =>
                                <Combobox.Option
                                    value={item.id}
                                    key={item.id}
                                    className={`activeItem ${activeTab == item.id ? "selectedItem" : ""}`}
                                > {getDetailsTabTitle(item)}</Combobox.Option>)
                    }
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
