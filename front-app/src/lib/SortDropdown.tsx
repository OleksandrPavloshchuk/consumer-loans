import {Combobox, TextInput, useCombobox} from "@mantine/core";
import {DropdownArrow} from "./DropdownArrow.tsx";
import {getLocalization, localized} from "../i18n/language.ts";
import {useApplicationState} from "../ApplicationState.ts";

export type SortMode = "asc" |"desc";
const SORTS: SortMode[] = ["asc", "desc"];

type Props = {
    value: SortMode,
    setValue: (s: SortMode) => void
};

export const SortDropdown: React.FC<Props> = ({value, setValue}) => {
    const combobox = useCombobox();

    const handleSelect = (key: SortMode) => {
        combobox.resetSelectedOption();
        setValue(key);
        combobox.closeDropdown();
    }

    const handleChange = (s: SortMode) => {
        const idx = SORTS.findIndex((v: string) => v === s);
        if (idx >= 0) {
            combobox.selectOption(idx);
        }
        combobox.openDropdown();
        combobox.updateSelectedOptionIndex();
    };

    const language = useApplicationState((s) => s.language);
    const loc = getLocalization(language);

    return (
        <Combobox
            aria-label={"sort-dropdown"}
            withinPortal={true}
            zIndex={8000}
            store={combobox}
            onOptionSubmit={(v) => handleSelect(v as SortMode)}
        >
            <Combobox.Target>
                <TextInput
                    width={"auto"}
                    title={loc.sort.label}
                    value={localized(loc.sort,value)}
                    placeholder={loc.sort.label}
                    onFocus={() => combobox.openDropdown()}
                    onClick={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={<DropdownArrow target={combobox} color={"white"} />}
                    onChange={(event) =>
                        handleChange(event.currentTarget.value)
                    }
                />
            </Combobox.Target>
            <Combobox.Dropdown
                style={{
                    maxHeight: '100px',
                    overflowY: 'auto',
                }}
            >
                <Combobox.Options>
                    {
                        SORTS
                            .map((item) =>
                                <Combobox.Option
                                    value={item}
                                    key={item}
                                    className="activeItem"
                                > {localized(loc.sort, item)}</Combobox.Option>)
                    }
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}