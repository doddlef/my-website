import Box from "@mui/material/Box";
import SpeedDial from '@mui/material/SpeedDial';
import {ChangeEvent, useRef, useState} from "react";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CatchingPokemonOutlinedIcon from '@mui/icons-material/CatchingPokemonOutlined';
import Paper from "@mui/material/Paper";
import {motion} from "motion/react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {useUploadApi} from "../api/uploadApi2/UploadApiContext.ts";
import {styled} from "@mui/material/styles";
import {CircularProgress, CircularProgressProps, Tooltip} from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import {useContentCache} from "../api/driverCache/ContentCache.ts";

const LINE_HEIGHT = 60;

const StyledLine = styled(Box)(({theme}) => ({
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    height: LINE_HEIGHT,
    display: 'flex',
    gap: "1rem",
    alignItems: "center",
    padding: "0.5rem",
}));

export default function UploadHelper() {
    const [detail, setDetail] = useState(false);
    const { upload, tasks } = useUploadApi();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { currentFolder } = useContentCache();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            upload({file: file, folder: currentFolder}).then(() => console.log('adding into queue'));
        }
        event.target.value = "";
    };

    return (
        <>
            <SpeedDial
                className={"absolute right-8 bottom-8"}
                ariaLabel={"upload helper"}
                hidden={detail}
                onClick={() => setDetail(!detail)}
                icon={<AssignmentOutlinedIcon />}
                direction={"up"}
            />
            <Paper
                className={"w-96 absolute right-8 bottom-8 overflow-hidden"}
                sx={{borderRadius: 2}}
                elevation={2}
                component={motion.div}
                animate={{
                    opacity: detail ? 1 : 0,
                    y: detail ? 0 : 80
                }}
            >
                <Box
                    sx={{bgcolor: "primary.main", color: "primary.contrastText"}}
                    className={"p-2 flex gap-2 items-center"}
                >
                    <IconButton onClick={() => setDetail(!detail)}>
                        <CloseOutlinedIcon sx={{color: "primary.contrastText"}}/>
                    </IconButton>
                    <Typography variant={"h6"} className={"flex-1"}>
                        Upload Task
                    </Typography>
                    <IconButton
                        onClick={handleClick}
                    >
                        <AddOutlinedIcon sx={{color: "primary.contrastText"}}/>
                    </IconButton>
                </Box>
                <Stack
                    sx={{minHeight: LINE_HEIGHT, maxHeight: LINE_HEIGHT * 3}}
                    className={"p-2 overflow-y-auto"}
                    spacing={1}
                    divider={<Divider />}
                >
                    {tasks.length === 0 ? (
                        <StyledLine>
                            <Inventory2OutlinedIcon />
                            <Typography variant={"subtitle1"} sx={{color: "text.secondary"}}>
                                No upload task.
                            </Typography>
                        </StyledLine>
                    ) : tasks.map((task) => (
                        <StyledLine className={"justify-between"}>
                            <Box className={"max-w-80 overflow-hidden"}>
                                <Tooltip
                                    title={task.name}
                                    arrow={true}
                                    placement={"top"}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {task.name}
                                    </Typography>
                                </Tooltip>
                                <div className={"flex gap-4"}>
                                    <Typography variant={"subtitle2"} sx={{color: "text.secondary"}}>
                                        {task.status}
                                    </Typography>
                                </div>
                            </Box>
                            { task.progress >= 1
                                ? <CatchingPokemonOutlinedIcon color={"success"} />
                                : <CircularProgressWithLabel variant={"determinate"} value={task.progress * 100} />
                            }
                        </StyledLine>
                    ))}
                </Stack>
            </Paper>
            <input type={"file"} className={"hidden"} ref={fileInputRef} onChange={handleFileChange} />
        </>
    );
}

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}