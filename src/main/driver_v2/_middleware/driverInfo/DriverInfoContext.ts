import {createContext, useContext} from "react";
import {DriverInfo} from "../../definations.ts";


type DriverInfoContextType = {
    info: DriverInfo;
    refreshInfo: () => Promise<void>;
}

export const DriverInfoContext = createContext<DriverInfoContextType | null>(null);

export const useDriverInfo = () => {
    const context = useContext(DriverInfoContext);

    if (!context) {
        throw new Error("useDriverInfo must be used within an DriverInfoProvider");
    }

    return context;
}