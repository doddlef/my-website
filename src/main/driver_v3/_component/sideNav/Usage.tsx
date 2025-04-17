import {useMemo} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import useDriver from "../../_hooks/useDriver.ts";
import {formatFileSize} from "../../utils.ts";

function Usage() {
    const { usedSpace, maxSpace } = useDriver();
    const used = useMemo(() => formatFileSize(usedSpace), [usedSpace]);
    const max = useMemo(() => formatFileSize(maxSpace), [maxSpace]);

    return (
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
    )
}

export default Usage;