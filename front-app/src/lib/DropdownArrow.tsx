import {ActionIcon, type ComboboxStore} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

type Props = {
    target: ComboboxStore
}

export const DropdownArrow: React.FC<Props> = ({target}) => {
    return (
        target.dropdownOpened
            ? <ActionIcon
                onClick={() => target.closeDropdown()}
                variant="light"
                size="md"
                title="Close">
                <IconChevronUp size={16}/>
            </ActionIcon>

            : <ActionIcon
                onClick={() => target.openDropdown()}
                variant="light"
                size="md"
                title="Open">
                <IconChevronDown size={16}/>
            </ActionIcon>
    );
}