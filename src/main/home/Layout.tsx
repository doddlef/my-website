import Box from "@mui/material/Box";
import "../../_fonts/pacifico.css";
import "../../_fonts/sour_gummy.css";
import "../../_fonts/tektur.css";
import WelcomePage from "./_page/WelcomePage.tsx";
import HorizonPage from "./_page/HorizonPage.tsx";

export default function Layout() {

    return (
        <Box
            component={"main"}
            className={"overflow-y-scroll overflow-x-hidden snap-mandatory snap-y w-screen h-screen relative"}
            sx={{bgcolor: "background.default"}}
        >
            <div className={"snap-start"}>
                <WelcomePage/>
            </div>
            <div className={"snap-start"}>
                <HorizonPage/>
            </div>
            <div className={"w-full h-screen bg-blue-400 snap-start"} />
            <div className={"w-full h-screen bg-red-400 snap-y"}/>
            <div className={"w-full h-screen bg-green-400 snap-start"}/>
            <div className={"w-full h-screen bg-yellow-400 snap-start"}/>
        </Box>
    );
}