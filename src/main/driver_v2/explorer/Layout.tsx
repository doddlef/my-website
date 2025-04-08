import PaginationProvider from "../_middleware/Explorer/Pagination/PaginationProvider.tsx";
import SelectedProvider from "../_middleware/Explorer/Selected/SelectedProvider.tsx";
import Modals from "../_component/Explorer/Modal/Modals.tsx";
import BreadcrumbNav from "../_component/Explorer/BreadcrumbNav.tsx";
import ItemList from "../_component/Explorer/ItemList.tsx";
import Stack from "@mui/material/Stack";
import UploadHelper from "../_component/Explorer/UploadHelper/UploadHelper.tsx";
import ModalsProvider from "../_middleware/Explorer/useModals/ModalsProvider.tsx";
import ItemPreview from "../_component/Explorer/preview/Previews.tsx";

export default function Layout() {
    return (
        <PaginationProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <ItemPreview>
                        <Modals />
                        <Stack
                            spacing={2}
                            className={"w-full h-full bg-gray-100 dark:bg-gray-800 rounded-tl-3xl p-4 relative overflow-hidden"}
                        >
                            <BreadcrumbNav />
                            <ItemList />
                        </Stack>
                        <UploadHelper />
                    </ItemPreview>
                </ModalsProvider>
            </SelectedProvider>
        </PaginationProvider>
    );
}