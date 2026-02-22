import {ActionIcon, type ComboboxStore} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import { forwardRef } from "react";

type Props = {
    target: ComboboxStore,
    count?: number,
    color?: string
}

export const DropdownArrow: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(({target, count, color}, ref) => {

    const countTag = count && count>0
        ? <span className="openTabsCount">{count}</span>
        : null;

    return (
        target.dropdownOpened
            ? <ActionIcon
                ref={ref}
                aria-label="dropdown-arrow"
                onClick={() => target.closeDropdown()}
                variant="light"
                size="md"
            >
                <IconChevronUp
                    size={16} style={{color: color}}
                />
                {countTag}
            </ActionIcon>

            : <ActionIcon
                ref={ref}
                aria-label="dropdown-arrow"
                onClick={() => target.openDropdown()}
                variant="light"
                size="md"
            >
                <IconChevronDown
                    size={16} style={{color: color}}
                />
                {countTag}
            </ActionIcon>
    );
});