import {CircularProgress} from "@mui/material";

function LoadingPlaceHolder() {
    return (
        <div className={"w-full h-full flex justify-center items-center"}>
            <CircularProgress color={"secondary"} />
        </div>
    );
}

export default LoadingPlaceHolder;