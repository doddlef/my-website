import Box from "@mui/material/Box";
import {useDriverInfo} from "../_lib/driverInfo/DriverInfoContext.ts";
import {useMemo} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import {formatFileSize} from "../_lib/utils.ts";

export default function NavSideBar() {
    const { usedSpace, maxSpace } = useDriverInfo().info;
    const used = useMemo(() => formatFileSize(usedSpace), [usedSpace]);
    const max = useMemo(() => formatFileSize(maxSpace), [maxSpace]);

    return (
        <Box
            sx={{width: 240, minWidth: 240}}
            className={"h-full flex flex-col"}
        >
            <div className={"flex-1"}/>
            <div className={"pt-6 pb-6 pl-4 pr-4 w-full flex flex-col gap-2 items-center"}>
                <div className={"w-full"}>
                    <LinearProgress
                        variant={"determinate"}
                        value={usedSpace * 100 / maxSpace}
                        color={usedSpace / maxSpace > 0.7 ? "error" : "success"}
                    />
                </div>
                <Typography variant={"subtitle2"}>
                    {`${used} out of ${max} used`}
                </Typography>
            </div>
        </Box>
    );
}