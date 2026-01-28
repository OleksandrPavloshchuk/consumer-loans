import {describe, it, vi, expect} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {SortArrow} from "./SortArrow";
import {MantineProvider} from "@mantine/core";
import {mockMatchMedia} from "./utils.ts";

describe("SortArrow", () => {

    it("switch from ASC to DESC", () => {
        mockMatchMedia(vi);

        const setOrder = vi.fn();
        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
            <SortArrow order="asc" setOrder={setOrder}/>
        </MantineProvider>);
        const button = screen.getByLabelText("sort-arrow");
        fireEvent.click(button);
        expect(setOrder).toHaveBeenCalledWith("desc");
    });

    it("switch from DESC to ASC", () => {
        mockMatchMedia(vi);

        const setOrder = vi.fn();
        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
            <SortArrow order="desc" setOrder={setOrder}/>
        </MantineProvider>);
        const button = screen.getByLabelText("sort-arrow");
        fireEvent.click(button);
        expect(setOrder).toHaveBeenCalledWith("asc");
    });

});