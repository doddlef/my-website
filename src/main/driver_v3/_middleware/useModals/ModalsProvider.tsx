import React, {useState} from "react";
import {ModalOption, ModalsContext} from "./ModalsContext.ts";

const ModalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modal, setModal] = useState<ModalOption>(null);

    return (
        <ModalsContext value={{ modal, changeModal: setModal}}>
            {children}
        </ModalsContext>
    )
}

export default ModalsProvider