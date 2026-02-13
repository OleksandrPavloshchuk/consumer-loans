import {Combobox, TextInput, useCombobox} from "@mantine/core";
import {DropdownArrow} from "./DropdownArrow.tsx";
import type {Language} from "../i18n/language.ts";
import {LANGUAGES} from "../i18n/language.ts";

type Props = {
    value: Language,
    setValue: (l: Language) => void
};

export const LanguagesDropdown: React.FC<Props> = ({value, setValue}) => {
    const combobox = useCombobox();

    const handleSelect = (key: Language) => {
        combobox.resetSelectedOption();
        setValue(key);
        combobox.closeDropdown();
    }

    const handleChange = (s: Language) => {
        const idx = LANGUAGES.findIndex((v: string) => v === s);
        if (idx >= 0) {
            combobox.selectOption(idx);
        }
        combobox.openDropdown();
        combobox.updateSelectedOptionIndex();
    };

    return (
        <Combobox
            w={75}
            withinPortal={true}
            zIndex={8000}
            store={combobox}
            onOptionSubmit={(v) => handleSelect(v as Language)}
        >
            <Combobox.Target>
                <TextInput
                    title={"Language"}
                    value={value}
                    placeholder="Country"
                    onFocus={() => combobox.openDropdown()}
                    onClick={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={<DropdownArrow target={combobox}/>}
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
                        LANGUAGES
                            .map((item) =>
                                <Combobox.Option
                                    value={item}
                                    key={item}
                                >{item}</Combobox.Option>)
                    }
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}