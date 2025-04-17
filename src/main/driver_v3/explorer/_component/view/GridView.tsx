import Grid from "@mui/material/Grid2";
import {ItemView} from "../../../definitions.ts";
import {NavigateFunction} from "react-router-dom";
import useSelected from "../../../_middleware/useSelected/useSelected.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ObjectWrapper from "../ObjectWrapper.tsx";

interface GridViewProps {
    folders: ItemView[];
    files: ItemView[];
    navigate: NavigateFunction;
}

function GridView({ folders, files, navigate } : GridViewProps) {
    const { add } = useSelected();

    return (
        <Grid className="p-4 pb-24 overflow-x-hidden" container spacing={3}>
            { folders.length > 0 && (
                <Grid size={12}>
                    <div className={"flex gap-2 items-center justify-between"}>
                        <Typography variant={"subtitle1"} color={"textSecondary"}>
                            folders
                        </Typography>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            folders.forEach(folder => add(folder.id));
                        }}>
                            <DoneAllIcon fontSize={"small"}/>
                        </IconButton>
                    </div>
                </Grid>
            )}
            { folders.map((folder) => (
                <Grid size={3} key={folder.id}>
                    <ObjectWrapper item={folder} navigate={navigate} itemMenu={() => {}} />
                </Grid>
            ))}

            { files.length > 0 && (
                <Grid size={12}>
                    <div className={"flex gap-2 items-center justify-between"}>
                        <Typography variant={"subtitle1"} color={"textSecondary"}>
                            files
                        </Typography>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            files.forEach(file => add(file.id));
                        }}>
                            <DoneAllIcon fontSize={"small"}/>
                        </IconButton>
                    </div>
                </Grid>
            )}
            { files.map((file) => (
                <Grid size={3} key={file.id}>
                    <ObjectWrapper item={file} navigate={navigate} itemMenu={() => {}} />
                </Grid>
            ))}
        </Grid>
    );
}

export default GridView;