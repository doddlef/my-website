import Stack from "@mui/material/Stack";
import ItemList from "../_component/(RecycleBin)/ItemList.tsx";
import RecycleBinProvider from "../_middleware/(RecycleBin)/useRecycleBin/RecycleBinProvider.tsx";
import SelectedProvider from "../_middleware/Selected/SelectedProvider.tsx";
import RecycleHeader from "../_component/(RecycleBin)/RecycleHeader.tsx";
import ModalsProvider from "../_middleware/useModals/ModalsProvider.tsx";
import DeleteForeverDialog from "../_component/(RecycleBin)/DeleteForeverDialog.tsx";
import UploadHelper from "../_component/UploadHelper/UploadHelper.tsx";

export default function Layout() {
    return (
        <RecycleBinProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <Stack
                        spacing={2}
                        className={"w-full h-full"}
                    >
                        <RecycleHeader />
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