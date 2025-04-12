import {useCallback} from "react";
import useModals from "../../../_middleware/useModals/ModalsContext.ts";
import CreateFolderDialog from "./CreateFolderDialog.tsx";
import RenameItemDialog from "./RenameItemDialog.tsx";
import DeleteModel from "./DeleteModel.tsx";

export default function Modals() {
    const { modal, changeModal } = useModals();

    const handleClose = useCallback(() => {
        changeModal(null);
    }, [changeModal]);

    return (
        <>
            <CreateFolderDialog open={modal === "create_folder"} handleClose={handleClose} />
            <RenameItemDialog open={modal === "rename"} handleClose={handleClose} />
            <DeleteModel open={modal === "delete"} handleClose={handleClose} />
        </>
    );
}