import {createContext, useContext} from "react";

export type ModalOption = string | null;

export interface ModalsContextType {
    modal: ModalOption | null;
    changeModal: (modal: ModalOption | null) => void;
}

export const ModalsContext = createContext<ModalsContextType | null>(null);

export const useModals = (): ModalsContextType => {
    const ctx = useContext(ModalsContext);
    if (!ctx) {
        throw new Error('useModals must be used within ModalProvider');
    }
    return ctx;
};

export default useModals;