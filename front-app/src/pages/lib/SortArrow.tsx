import {ActionIcon} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

export type SortMode = "asc" | "desc";

type Props = {
    order: SortMode,
    setOrder: (m:SortMode) => void
};

export const SortArrow: React.FC<Props> = ({order, setOrder}) => {

    return (
        order == "asc"
            ? <ActionIcon
                onClick={() => setOrder("desc")}
                variant="light"
                size="md">
                <IconChevronDown size={16}/>
            </ActionIcon>

            : <ActionIcon
                onClick={() => setOrder("asc")}
                variant="light"
                size="md">
                <IconChevronUp size={16}/>
            </ActionIcon>
    );
}