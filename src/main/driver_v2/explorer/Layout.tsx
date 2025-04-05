import PaginationProvider from "../_middleware/Pagination/PaginationProvider.tsx";
import SelectedProvider from "../_middleware/Selected/SelectedProvider.tsx";
import Modals from "../_component/Explorer/Modal/Modals.tsx";
import BreadcrumbNav from "../_component/Explorer/BreadcrumbNav.tsx";
import ItemList from "../_component/Explorer/ItemList.tsx";
import Stack from "@mui/material/Stack";
import UploadHelper from "../_component/Explorer/UploadHelper/UploadHelper.tsx";
import ModalsProvider from "../_middleware/useModals/ModalsProvider.tsx";

export default function Layout() {
    return (
        <PaginationProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <Modals />
                    <Stack
                        spacing={2}
                        className={"w-full h-full overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-tl-3xl p-4 relative"}
                    >
                        <BreadcrumbNav />
                        <ItemList />
                    </Stack>
                    <UploadHelper />
                </ModalsProvider>
            </SelectedProvider>
        </PaginationProvider>
    );
}