import Stack from "@mui/material/Stack";
import ContentCacheProvider from "../_component/api/driverCache/ContentCacheProvider.tsx";
import BreadcrumbNav from "../_component/BreadcrumbNav/BreadcrumbNav.tsx";
import ItemTable from "../_component/ItemTable/ItemTable.tsx";
import UploadHelper from "../_component/UploadHelper/UploadHelper.tsx";

export default function ContentPage() {
    return (
        <ContentCacheProvider>
            <Stack
                spacing={2}
                className={"w-full h-full overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-tl-3xl p-4 relative"}
            >
                <BreadcrumbNav />
                <ItemTable />
                <UploadHelper />
            </Stack>
        </ContentCacheProvider>
    );
}