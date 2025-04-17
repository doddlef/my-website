import PreviewWindow from "./_component/PreviewWindow.tsx";
import Modals from "./_component/modal/Modals.tsx";
import Grid from "@mui/material/Grid2";
import BreadcrumbHeader from "./_component/BreadcrumbHeader.tsx";
import EditHeader from "./_component/EditHeader.tsx";
import PaginationHeader from "./_component/PaginationHeader.tsx";
import Display from "./_component/Display.tsx";

function Page() {
    return (
        <PreviewWindow>
            <Modals />
            <div className={"w-full h-full flex flex-col"}>
                <Grid container spacing={2} className={"w-full"}>
                    <Grid size={6}>
                        <BreadcrumbHeader />
                    </Grid>
                    <Grid size={3}>
                        <EditHeader />
                    </Grid>
                    <Grid size={3}>
                        <PaginationHeader />
                    </Grid>
                </Grid>
                <div className="flex-1 min-h-0 mt-4">
                    <Display />
                </div>
            </div>
        </PreviewWindow>
    );
}

export default Page;

