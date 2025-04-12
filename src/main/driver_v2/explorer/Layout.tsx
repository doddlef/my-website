import PaginationProvider from "../_middleware/(Explorer)/Pagination/PaginationProvider.tsx";
import SelectedProvider from "../_middleware/Selected/SelectedProvider.tsx";
import Modals from "../_component/(Explorer)/Modal/Modals.tsx";
import BreadcrumbsHeader from "../_component/(Explorer)/BreadcrumbsHeader.tsx";
import ItemList from "../_component/(Explorer)/ItemList.tsx";
import Stack from "@mui/material/Stack";
import ModalsProvider from "../_middleware/useModals/ModalsProvider.tsx";
import ItemPreview from "../_component/(Explorer)/preview/Previews.tsx";
import ViewHeader from "../_component/(Explorer)/ViewHeader.tsx";
import UploadHelperWrapper from "../_component/(Explorer)/UploadHelperWrapper.tsx";

export default function Layout() {
    return (
        <PaginationProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <ItemPreview>
                        <Modals />
                        <Stack
                            spacing={2}
                            className={"w-full h-full relative overflow-hidden"}
                        >
                            <BreadcrumbsHeader />
                            <ViewHeader />
                            <ItemList />
                        </Stack>
                        <UploadHelperWrapper />
                    </ItemPreview>
                </ModalsProvider>
            </SelectedProvider>
        </PaginationProvider>
    );
}