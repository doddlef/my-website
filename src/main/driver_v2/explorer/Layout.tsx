import PaginationProvider from "../_middleware/(Explorer)/Pagination/PaginationProvider.tsx";
import SelectedProvider from "../_middleware/Selected/SelectedProvider.tsx";
import Modals from "../_component/(Explorer)/Modal/Modals.tsx";
import BreadcrumbsHeader from "../_component/(Explorer)/BreadcrumbsHeader.tsx";
import ItemList from "../_component/(Explorer)/ItemList.tsx";
import ModalsProvider from "../_middleware/useModals/ModalsProvider.tsx";
import ItemPreview from "../_component/(Explorer)/preview/Previews.tsx";
import UploadHelperWrapper from "../_component/(Explorer)/UploadHelperWrapper.tsx";
import PaginationHeader from "../_component/(Explorer)/PaginationHeader.tsx";
import Grid from "@mui/material/Grid2";
import ViewHeader from "../_component/(Explorer)/ViewHeader.tsx";

export default function Layout() {
    return (
        <PaginationProvider>
            <SelectedProvider>
                <ModalsProvider>
                    <ItemPreview>
                        <Modals />
                        <div className={"w-full h-full flex flex-col"}>
                            <Grid container spacing={2} className={"w-full"}>
                                <Grid size={6}>
                                    <BreadcrumbsHeader />
                                </Grid>
                                <Grid size={3}>
                                    <ViewHeader />
                                </Grid>
                                <Grid size={3}>
                                    <PaginationHeader />
                                </Grid>
                            </Grid>
                            <div className="flex-1 min-h-0 mt-4">
                                <ItemList />
                            </div>
                        </div>
                        <UploadHelperWrapper/>
                    </ItemPreview>
                </ModalsProvider>
            </SelectedProvider>
        </PaginationProvider>
    );
}