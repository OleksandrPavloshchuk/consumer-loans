import {describe, it, vi, expect} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {SortArrow} from "./SortArrow";
import {MantineProvider} from "@mantine/core";

describe("SortArrow", () => {

    it("switch from ASC to DESC", () => {
        mockMatchMedia();

        const setOrder = vi.fn();
        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
            <SortArrow order="asc" setOrder={setOrder}/>
        </MantineProvider>);
        const button = screen.getByLabelText("sort-arrow");
        fireEvent.click(button);
        expect(setOrder).toHaveBeenCalledWith("desc");
    });

});

const mockMatchMedia = () => Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // legacy
        removeListener: vi.fn(), // legacy
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});