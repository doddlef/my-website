import {UploadHistory} from "../../_middleware/uploadApi2/UploadApiContext.ts";
import CatchingPokemonOutlinedIcon from "@mui/icons-material/CatchingPokemonOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CircularProgressWithLabel from "./CircularProgressWithLabel.tsx";

export default function StatusIcon({task} : {task: UploadHistory}) {
    switch(task.status) {
        case "uploading":
            return <CircularProgressWithLabel variant={"determinate"} value={task.progress * 100} />;
        case "finished":
            return <CatchingPokemonOutlinedIcon color={"success"} />;
        case "waiting": case "preparing":
            return <HourglassTopOutlinedIcon color={"primary"}/>
        case "cancelled":
            return <ErrorOutlineOutlinedIcon color={"primary"} />
        default:
            return <ErrorOutlineOutlinedIcon color={"error"} />
    }
}