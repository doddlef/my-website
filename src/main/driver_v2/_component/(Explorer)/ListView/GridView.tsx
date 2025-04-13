import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {ItemView} from "../../../definations.ts";
import ObjectWrapper from "../ObjectWrapper.tsx";
import {NavigateFunction} from "react-router-dom";
import useSelected from "../../../_middleware/Selected/SelectedContext.ts";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import IconButton from "@mui/material/IconButton";

interface GridViewProps {
    folders: ItemView[];
    files: ItemView[];
    navigate: NavigateFunction;
    itemMenu: (el: HTMLElement) => void;
    remove: (id: number) => void;
}

export default function GridView({ folders, files, navigate, itemMenu, remove }: GridViewProps) {
    const { add } = useSelected();

    return (
        <Grid className="p-4 overflow-x-hidden" container spacing={3}>
            {folders.length > 0 && (
                <Grid size={12}>
                    <div className={"flex gap-2 items-center justify-between"}>
                        <Typography variant="subtitle1" color="textSecondary">
                            folders
                        </Typography>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            folders.forEach(add);
                        }}>
                            <DoneAllIcon fontSize={"small"}/>
                        </IconButton>
                    </div>
                </Grid>
            )}
            {folders.map((folder) => (
                <Grid size={3} key={folder.id}>
                    <ObjectWrapper item={folder} navigate={navigate} itemMenu={itemMenu} removeItem={remove} />
                </Grid>
            ))}
            {files.length > 0 && (
                <Grid size={12}>
                    <div className={"flex gap-2 items-center justify-between"}>

                        <Typography variant="subtitle1" color="textSecondary">
                            files
                        </Typography>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            files.forEach(add);
                        }}>
                            <DoneAllIcon fontSize={"small"}/>
                        </IconButton>
                    </div>
                </Grid>
            )}
            {files.map((file) => (
                <Grid size={3} key={file.id}>
                    <ObjectWrapper item={file} navigate={navigate} itemMenu={itemMenu} removeItem={remove} />
                </Grid>
            ))}
        </Grid>
    );
}