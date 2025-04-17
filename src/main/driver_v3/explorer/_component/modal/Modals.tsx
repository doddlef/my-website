import useModals from "../../../_middleware/useModals/ModalsContext.ts";
import {useCallback} from "react";
import CreateFolderDialog from "./CreateFolderDialog.tsx";
import RenameItemDialog from "./RenameItemDialog.tsx";

function Modals() {
    const { modal, changeModal } = useModals();

    const handleClose = useCallback(() => {
        changeModal(null);
    }, [changeModal]);

    return (
        <>
            <CreateFolderDialog open={modal === "create_folder"} handleClose={handleClose} />
            <RenameItemDialog open={modal === "rename"} handleClose={handleClose} />
        </>
    )
}

export default Modals;