import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Paper from "@mui/material/Paper";
import { motion } from "motion/react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { enqueueSnackbar } from "notistack";
import StatusIcon from "./StatusIcon.tsx";
import {useUploadApi} from "../../_middleware/uploadApi2/UploadApiContext.ts";

const LINE_HEIGHT = 60;

const StyledLine = styled(Box)(({ theme }) => ({
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    height: LINE_HEIGHT,
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    padding: "0.5rem",
}));

type UploadHelperProps = {
    folder?: number;
};

export default function UploadHelper({ folder }: UploadHelperProps) {
    const [detail, setDetail] = useState(false);
    const { upload, tasks } = useUploadApi();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const stackRef = useRef<HTMLDivElement | null>(null);
    const isAtBottomRef = useRef(true);

    const uploadAble = useMemo(() => Boolean(folder), [folder]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files?.length && folder) {
            Array.from(files).forEach(file => {
                upload({ file, folder }).then(() => console.log(`Added ${file.name} to queue`));
            });
        } else {
            enqueueSnackbar("Must specify a folder", { variant: "error" });
        }
        event.target.value = "";
    }, [folder, upload]);

    const handleScroll = () => {
        const el = stackRef.current;
        if (el) {
            const { scrollTop, scrollHeight, clientHeight } = el;
            isAtBottomRef.current = scrollTop + clientHeight >= scrollHeight - 10;
        }
    };

    useEffect(() => {
        const el = stackRef.current;
        if (el && isAtBottomRef.current) {
            el.scrollTop = el.scrollHeight;
        }
    }, [tasks.length]);

    return (
        <>
            <SpeedDial
                className="absolute right-8 bottom-8"
                ariaLabel="upload helper"
                hidden={detail}
                onClick={() => setDetail(!detail)}
                icon={<AssignmentOutlinedIcon />}
                direction="up"
            />
            <Paper
                className="w-96 fixed right-8 bottom-8 overflow-hidden z-[100]"
                sx={{ borderRadius: 2 }}
                elevation={2}
                component={motion.div}
                initial={{
                    opacity: 0,
                    y: 400,
                }}
                animate={{
                    opacity: detail ? 1 : 0,
                    y: detail ? 0 : 400,
                }}
            >
                <Box
                    sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
                    className="p-2 flex gap-2 items-center"
                >
                    <IconButton onClick={() => setDetail(!detail)}>
                        <CloseOutlinedIcon sx={{ color: "primary.contrastText" }} />
                    </IconButton>
                    <Typography variant="h6" className="flex-1">
                        Upload Task {detail ? "true" : "false"}
                    </Typography>
                    {uploadAble && (
                        <IconButton onClick={handleClick}>
                            <AddOutlinedIcon sx={{ color: "primary.contrastText" }} />
                        </IconButton>
                    )}
                </Box>
                <Stack
                    ref={stackRef}
                    onScroll={handleScroll}
                    sx={{ minHeight: LINE_HEIGHT, maxHeight: LINE_HEIGHT * 4, overflowY: "auto" }}
                    className="p-2 scroll-smooth"
                    spacing={1}
                    divider={<Divider />}
                    direction="column"
                >
                    {tasks.length === 0 ? (
                        <StyledLine>
                            <Inventory2OutlinedIcon />
                            <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                                No upload task.
                            </Typography>
                        </StyledLine>
                    ) : tasks.map(task => (
                        <StyledLine className="justify-between" key={task.id}>
                            <Box className="max-w-80 overflow-hidden">
                                <Tooltip title={task.name} arrow>
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
                                <div className="flex gap-4">
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                                        {task.status}
                                    </Typography>
                                </div>
                            </Box>
                            <StatusIcon task={task} />
                        </StyledLine>
                    ))}
                </Stack>
            </Paper>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
            />
        </>
    );
}