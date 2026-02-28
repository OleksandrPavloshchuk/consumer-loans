import {Combobox, TextInput, useCombobox} from "@mantine/core";
import {DropdownArrow} from "./DropdownArrow.tsx";
import {type Language, LANGUAGES} from "../i18n/language.ts";
import {useLocalization} from "../i18n/useLocalization.ts";

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

    const loc = useLocalization();

    return (
        <Combobox
            aria-label={"language-dropdown"}
            w={75}
            withinPortal={true}
            zIndex={8000}
            store={combobox}
            onOptionSubmit={(v) => handleSelect(v as Language)}
            styles={ (theme) => ({
                dropdown: {
                    color: theme.colors.gray[1],
                    backgroundColor: theme.colors.gray[6]
                }
            })}
        >
            <Combobox.Target>
                <TextInput
                    title={loc.common.language}
                    value={value}
                    placeholder={loc.common.language}
                    onFocus={() => combobox.openDropdown()}
                    onClick={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={<DropdownArrow target={combobox} color={"white"} />}
                    onChange={(event) =>
                        handleChange(event.currentTarget.value)
                    }
                    styles={(theme) => ({
                        input: {
                            color: theme.colors.gray[1],
                            backgroundColor: theme.colors.gray[6]
                        }
                    })}
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
                                    className="activeItem"
                                > {item}</Combobox.Option>)
                    }
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}