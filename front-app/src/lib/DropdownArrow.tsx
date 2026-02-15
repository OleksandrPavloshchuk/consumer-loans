import {ActionIcon, type ComboboxStore} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

type Props = {
    target: ComboboxStore
}

export const DropdownArrow: React.FC<Props> = ({target}) => {
    return (
        target.dropdownOpened
            ? <ActionIcon
                aria-label="dropdown-arrow"
                onClick={() => target.closeDropdown()}
                variant="light"
                size="md"
                style={{color: "white"}}
            >
                <IconChevronUp
                    size={16}
                    style={{color: "white"}}
                />
            </ActionIcon>

            : <ActionIcon
                aria-label="dropdown-arrow"
                onClick={() => target.openDropdown()}
                variant="light"
                size="md"
                style={{color: "white"}}
            >
                <IconChevronDown
                    size={16}
                    style={{color: "white"}}
                />
            </ActionIcon>
    );
}