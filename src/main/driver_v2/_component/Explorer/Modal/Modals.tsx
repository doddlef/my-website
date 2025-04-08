import {useCallback} from "react";
import CreateFolderDialog from "./CreateFolderDialog.tsx";
import useModals from "../../../_middleware/Explorer/useModals/ModalsContext.ts";
import RenameItemDialog from "./RenameItemDialog.tsx";

export default function Modals() {
    const { modal, changeModal } = useModals();

    const handleClose = useCallback(() => {
        changeModal(null);
    }, [changeModal]);

    return (
        <>
            <CreateFolderDialog open={modal === "create_folder"} handleClose={handleClose} />
            <RenameItemDialog open={modal === "rename"} handleClose={handleClose} />
        </>
    );
}