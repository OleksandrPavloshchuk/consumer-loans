import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {MantineProvider} from "@mantine/core";
import {mockMatchMedia} from "./utils.ts";
import {DropdownArrow} from "./DropdownArrow.tsx";
import userEvent from "@testing-library/user-event";

describe("DropdownArrow", () => {

    it("open dropdown on click, if it is closed", async () => {
        mockMatchMedia(vi);
        const openDropdownMock = vi.fn();
        const closeDropdownMock = vi.fn();
        const storeMock = {
            dropdownOpened: false,
            openDropdown: openDropdownMock,
            closeDropdown: closeDropdownMock
        } as any;
        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
            <DropdownArrow target={storeMock}/>
        </MantineProvider>);
        await userEvent.click(screen.getByLabelText("dropdown-arrow"));
        expect(openDropdownMock).toHaveBeenCalled();
        expect(closeDropdownMock).not.toHaveBeenCalled();
    });

    it("close dropdown on click, if it is open", async () => {
        mockMatchMedia(vi);
        const openDropdownMock = vi.fn();
        const closeDropdownMock = vi.fn();
        const storeMock = {
            dropdownOpened: true,
            openDropdown: openDropdownMock,
            closeDropdown: closeDropdownMock
        } as any;
        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
            <DropdownArrow target={storeMock}/>
        </MantineProvider>);
        await userEvent.click(screen.getByLabelText("dropdown-arrow"));
        expect(openDropdownMock).not.toHaveBeenCalled();
        expect(closeDropdownMock).toHaveBeenCalled();
    });

});