import {CircularProgress} from "@mui/material";

export default function LoadingHolder() {
    return (
        <div className={"w-full h-full flex justify-center items-center"}>
            <CircularProgress color={"secondary"} />
        </div>
    );
}