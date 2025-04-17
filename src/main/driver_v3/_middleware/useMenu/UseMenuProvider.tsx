import React, {useCallback, useState} from "react";
import { MenuContext } from "./useMenu";

interface UseMenuProviderProps {
    children: React.ReactNode;
}

function UseMenuProvider({children}: UseMenuProviderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuState, setMenuState] = useState<string | null>(null);

    const openMenu = useCallback((state: string) => {
        setMenuOpen(true);
        setMenuState(state);
    }, []);

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
    }, []);

    return (
        <MenuContext.Provider value={{openMenu, closeMenu, open: menuOpen, state: menuState}}>
            {children}
        </MenuContext.Provider>
    );
}

export default UseMenuProvider;