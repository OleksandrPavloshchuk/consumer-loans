import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {MantineProvider} from "@mantine/core";
import {mockMatchMedia} from "./utils.ts";
import userEvent from "@testing-library/user-event";
import {LanguagesDropdown} from "./LanguageDropdown.tsx";

describe("LanguageDropdown", () => {

    it("setValue on select", async () => {
        mockMatchMedia(vi);
        const setValueMock = vi.fn();
        render(<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
            <LanguagesDropdown value={"en"} setValue={setValueMock}/>
        </MantineProvider>);
        await userEvent.click(screen.getByLabelText("language-dropdown"));
        const uaOption = await screen.findByRole("option", {"name": "ua"});
        await userEvent.click(uaOption);

        expect(setValueMock).toHaveBeenCalledWith("ua");
    });
});