import PaginationProvider from "../_middleware/(Explorer)/Pagination/PaginationProvider.tsx";
import SelectedProvider from "../_middleware/Selected/SelectedProvider.tsx";
import Modals from "../_component/Explorer/Modal/Modals.tsx";
import BreadcrumbsHeader from "../_component/Explorer/BreadcrumbsHeader.tsx";
import ItemList from "../_component/Explorer/ItemList.tsx";
import Stack from "@mui/material/Stack";
import UploadHelper from "../_component/Explorer/UploadHelper/UploadHelper.tsx";
import ModalsProvider from "../_middleware/useModals/ModalsProvider.tsx";
import ItemPreview from "../_component/Explorer/preview/Previews.tsx";
import ViewHeader from "../_component/Explorer/ViewHeader.tsx";

export default function Layout() {
    return (
        <PaginationProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <ItemPreview>
                        <Modals />
                        <Stack
                            spacing={2}
                            className={"w-full h-full flex flex-col bg-gray-100 dark:bg-gray-800 rounded-tl-3xl p-4 relative overflow-hidden"}
                        >
                            <BreadcrumbsHeader />
                            <ViewHeader />
                            <ItemList />
                        </Stack>
                        <UploadHelper />
                    </ItemPreview>
                </ModalsProvider>
            </SelectedProvider>
        </PaginationProvider>
    );
}