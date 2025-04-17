import { createContext, useContext } from "react";
import { DriverInfo } from "../definitions.ts";

export interface DriverContextType extends DriverInfo {
    refresh: () => Promise<void>;
}

export const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const useDriver = (): DriverContextType => {
    const context = useContext(DriverContext);
    if (!context) {
        throw new Error("useDriver must be used within a DriverProvider");
    }
    return context;
};

export default useDriver;