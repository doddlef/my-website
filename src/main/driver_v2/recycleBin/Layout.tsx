import Stack from "@mui/material/Stack";
import ItemList from "../_component/(RecycleBin)/ItemList.tsx";
import RecycleBinProvider from "../_middleware/(RecycleBin)/useRecycleBin/RecycleBinProvider.tsx";
import SelectedProvider from "../_middleware/Selected/SelectedProvider.tsx";
import RecycleHeader from "../_component/(RecycleBin)/RecycleHeader.tsx";
import ModalsProvider from "../_middleware/useModals/ModalsProvider.tsx";
import DeleteForeverDialog from "../_component/(RecycleBin)/DeleteForeverDialog.tsx";
import UploadHelper from "../_component/UploadHelper/UploadHelper.tsx";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

export default function Layout() {
    return (
        <RecycleBinProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <Stack
                        spacing={2}
                        className={"w-full h-full"}
                    >
                        <Grid container spacing={2} className={"w-full mt-4"} alignItems={"center"}>
                            <Grid size={2}>
                                <Typography variant={"h5"} className={"flex-1"}>Recycle Bin</Typography>
                            </Grid>
                            <Grid size={7}>
                                <Alert severity={"warning"}>
                                    Items in trash still take up storage, and will be deleted forever after
                                    <span> 14 days </span>after moved into trash
                                </Alert>
                            </Grid>
                            <Grid size={3}>
                                <RecycleHeader />
                            </Grid>
                        </Grid>
                        <div className={"flex-1 overflow-y-auto"}>
                            <ItemList />
                        </div>
                    </Stack>
                    <DeleteForeverDialog />
                    <UploadHelper />
                </ModalsProvider>
            </SelectedProvider>
        </RecycleBinProvider>
    );
}