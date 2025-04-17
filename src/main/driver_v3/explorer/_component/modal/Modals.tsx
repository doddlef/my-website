import useModals from "../../../_middleware/useModals/ModalsContext.ts";
import {useCallback} from "react";

function Modals() {
    const { modal, changeModal } = useModals();

    const handleClose = useCallback(() => {
        changeModal(null);
    }, [changeModal]);

    return (
        <>

        </>
    )
}

export default Modals;