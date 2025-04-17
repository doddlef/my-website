import { createContext, useContext } from "react";

export interface MenuContextType {
    openMenu: (state: string) => void;
    closeMenu: () => void;
    open: boolean;
    state: string | null;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
};

export default useMenu;