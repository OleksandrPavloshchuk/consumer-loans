import {MantineProvider} from "@mantine/core";
import {describe, it, vi, expect} from "vitest";
import {mockMatchMedia} from "./utils.ts";
import {fireEvent, render, screen} from "@testing-library/react";
import {TabbedPage} from "./TabbedPage.tsx";
import {TabbedPageItem} from "../camundaClient/domain.ts";

describe("TabbedPage", () => {

    it("only list tab", () => {
        mockMatchMedia(vi);

        const mockRenderListTab = vi.fn();
        const mockRenderDetailsTab = vi.fn();

        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: "light"}}>
            <TabbedPage
                pageId={"archive"}
                getDetailsTabTitle={(item) => item.id}
                renderListTab={mockRenderListTab}
                renderDetailsTab={mockRenderDetailsTab}
            />
        </MantineProvider>);

        expect(mockRenderListTab).toHaveBeenCalled();
        expect(mockRenderDetailsTab).not.toHaveBeenCalled();
    });

    it("open 2 detail tabs", () => {
        mockMatchMedia(vi);

        const mockRenderListTab = vi.fn((openTab: (item: TabbedPageItem) => void) =>
            (<ol>{[new TabbedPageItem("1st"), new TabbedPageItem("2nd")]
                .map((item) => <li key={item.id} aria-label={item.id} onClick={() => openTab(item)}>{item.id}</li>)}
            </ol>));
        const mockRenderDetailsTab = vi.fn();

        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: "light"}}>
            <TabbedPage
                pageId={"archive"}
                getDetailsTabTitle={(item) => item.id}
                renderListTab={mockRenderListTab}
                renderDetailsTab={mockRenderDetailsTab}
            />
        </MantineProvider>);
        let listItem = screen.getByLabelText("1st");
        fireEvent.click(listItem);
        listItem = screen.getByLabelText("2nd");
        fireEvent.click(listItem);
        // Render the 1st tab twice and the 2nd once during two refreshes
        expect(mockRenderDetailsTab).toHaveBeenCalledTimes(3);
    });

    it("open and close tab", () => {
        mockMatchMedia(vi);

        const mockRenderListTab = vi.fn((openTab: (item: TabbedPageItem) => void) =>
            (<ol>{[new TabbedPageItem("-")]
                .map((item) => <li key={item.id} aria-label={item.id} onClick={() => openTab(item)}>{item.id}</li>)}
            </ol>));
        const mockRenderDetailsTab = vi.fn();

        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: "light"}}>
            <TabbedPage
                pageId={"archive"}
                getDetailsTabTitle={(item) => item.id}
                renderListTab={mockRenderListTab}
                renderDetailsTab={mockRenderDetailsTab}
            />
        </MantineProvider>);
        let elem = screen.getByLabelText("-");
        fireEvent.click(elem);
        elem = screen.getByLabelText("close-tab--");
        fireEvent.click(elem);
        // It was rendered only once in 2 refreshes
        expect(mockRenderDetailsTab).toHaveBeenCalled();
    });

});