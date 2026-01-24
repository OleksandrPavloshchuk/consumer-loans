import {useApplicationState} from "../../ApplicationState.ts";
import {ArchiveMainTable} from "./MainTable.tsx";

export const ArchiveRoot: React.FC = () => {
    const setActivePageName = useApplicationState((s) => s.setActivePageName);
    setActivePageName("archive");

    return (
        <ArchiveMainTable />
    );
}
